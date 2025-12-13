"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { InfoTooltip } from "@/components/ui/tooltip";
import { apiFetch } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

// INDICATORS matching backtest2.py exactly
const INDICATORS = [
  { id: "RSI", name: "RSI (Relative Strength Index)" },
  { id: "MA", name: "Moving Average Crossover" },
  { id: "MACD", name: "MACD" },
  { id: "BollingerBands", name: "Bollinger Bands %B" },
  { id: "Stochastic", name: "Stochastic Oscillator" },
  { id: "ParabolicSAR", name: "Parabolic SAR" },
  { id: "TradingView", name: "TradingView Signal" },
  { id: "HeikenAshi", name: "Heiken Ashi" },
];

// All timeframes available (data has all indicators for each)
const TIMEFRAMES = ["1m", "5m", "15m", "1h", "4h", "1d"];
const RSI_LENGTHS = [7, 14, 21, 28]; // Only these are pre-calculated in parquet
const CONDITIONS = ["Less Than", "Greater Than", "Crossing Up", "Crossing Down"];
const MACD_PRESETS = [
  { value: "12,26,9", label: "12, 26, 9 (Standard)" },
  { value: "6,20,9", label: "6, 20, 9 (Fast)" },
  { value: "8,17,9", label: "8, 17, 9" },
  { value: "5,35,5", label: "5, 35, 5 (Slow)" },
  { value: "9,30,9", label: "9, 30, 9" },
  { value: "10,26,9", label: "10, 26, 9" },
  { value: "15,35,9", label: "15, 35, 9" },
  { value: "18,40,9", label: "18, 40, 9" },
];
const STOCHASTIC_PRESETS = [
  { value: "14,3,3", label: "14, 3, 3 (Standard)" },
  { value: "9,3,3", label: "9, 3, 3 (Fast)" },
  { value: "21,3,3", label: "21, 3, 3 (Slow)" },
];
const PSAR_PRESETS = [
  { value: "0.02,0.2", label: "0.02, 0.2 (Standard)" },
  { value: "0.01,0.1", label: "0.01, 0.1 (Conservative)" },
  { value: "0.03,0.3", label: "0.03, 0.3 (Aggressive)" },
];
const TRADINGVIEW_SIGNALS = ["Buy", "Strong Buy", "Sell", "Strong Sell", "Neutral"];

const PAIRS = [
  "BTC/USDT", "ETH/USDT", "SOL/USDT", "DOGE/USDT", "AVAX/USDT",
  "LINK/USDT", "NEAR/USDT", "LTC/USDT", "HBAR/USDT", "SUI/USDT"
];

function ConditionBuilder({ condition, onChange, onRemove }) {
  const handleChange = (key, value) => {
    onChange({
      ...condition,
      subfields: { ...condition.subfields, [key]: value }
    });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <select
          value={condition.indicator}
          onChange={(e) => onChange({ ...condition, indicator: e.target.value, subfields: { Timeframe: "1m" } })}
          className="font-medium bg-white border rounded-lg px-3 py-2"
        >
          {INDICATORS.map((ind) => (
            <option key={ind.id} value={ind.id}>{ind.name}</option>
          ))}
        </select>
        <button onClick={onRemove} className="text-red-500 hover:text-red-700 text-sm">
          Remove
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Timeframe</label>
          <select
            value={condition.subfields?.Timeframe || "1m"}
            onChange={(e) => handleChange("Timeframe", e.target.value)}
            className="w-full border rounded px-2 py-1.5 text-sm"
          >
            {TIMEFRAMES.map((tf) => (
              <option key={tf} value={tf}>{tf}</option>
            ))}
          </select>
        </div>

        {/* RSI Indicator */}
        {condition.indicator === "RSI" && (
          <>
            <div>
              <label className="text-xs text-gray-500 block mb-1">RSI Length</label>
              <select
                value={condition.subfields?.["RSI Length"] || 14}
                onChange={(e) => handleChange("RSI Length", parseInt(e.target.value))}
                className="w-full border rounded px-2 py-1.5 text-sm"
              >
                {RSI_LENGTHS.map((len) => (
                  <option key={len} value={len}>{len}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Condition</label>
              <select
                value={condition.subfields?.Condition || "Less Than"}
                onChange={(e) => handleChange("Condition", e.target.value)}
                className="w-full border rounded px-2 py-1.5 text-sm"
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Signal Value</label>
              <input
                type="number"
                value={condition.subfields?.["Signal Value"] || 30}
                onChange={(e) => handleChange("Signal Value", parseFloat(e.target.value))}
                className="w-full border rounded px-2 py-1.5 text-sm"
                min={0}
                max={100}
              />
            </div>
          </>
        )}

        {/* MA Indicator */}
        {condition.indicator === "MA" && (
          <>
            <div>
              <label className="text-xs text-gray-500 block mb-1">MA Type</label>
              <select
                value={condition.subfields?.["MA Type"] || "SMA"}
                onChange={(e) => handleChange("MA Type", e.target.value)}
                className="w-full border rounded px-2 py-1.5 text-sm"
              >
                <option value="SMA">SMA</option>
                <option value="EMA">EMA</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Fast MA</label>
              <select
                value={condition.subfields?.["Fast MA"] || 14}
                onChange={(e) => handleChange("Fast MA", parseInt(e.target.value))}
                className="w-full border rounded px-2 py-1.5 text-sm"
              >
                {[5, 10, 14, 20, 25, 50].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Slow MA</label>
              <select
                value={condition.subfields?.["Slow MA"] || 28}
                onChange={(e) => handleChange("Slow MA", parseInt(e.target.value))}
                className="w-full border rounded px-2 py-1.5 text-sm"
              >
                {[25, 50, 75, 100, 150, 200, 250].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Condition</label>
              <select
                value={condition.subfields?.Condition || "Crossing Up"}
                onChange={(e) => handleChange("Condition", e.target.value)}
                className="w-full border rounded px-2 py-1.5 text-sm"
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* MACD Indicator */}
        {condition.indicator === "MACD" && (
          <>
            <div>
              <label className="text-xs text-gray-500 block mb-1">MACD Preset</label>
              <select
                value={condition.subfields?.["MACD Preset"] || "12,26,9"}
                onChange={(e) => handleChange("MACD Preset", e.target.value)}
                className="w-full border rounded px-2 py-1.5 text-sm"
              >
                {MACD_PRESETS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">MACD Trigger</label>
              <select
                value={condition.subfields?.["MACD Trigger"] || "Crossing Up"}
                onChange={(e) => handleChange("MACD Trigger", e.target.value)}
                className="w-full border rounded px-2 py-1.5 text-sm"
              >
                <option value="Crossing Up">Crossing Up</option>
                <option value="Crossing Down">Crossing Down</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Line Trigger</label>
              <select
                value={condition.subfields?.["Line Trigger"] || ""}
                onChange={(e) => handleChange("Line Trigger", e.target.value)}
                className="w-full border rounded px-2 py-1.5 text-sm"
              >
                <option value="">Any</option>
                <option value="Greater Than 0">Above Zero</option>
                <option value="Less Than 0">Below Zero</option>
              </select>
            </div>
          </>
        )}

        {/* Bollinger Bands Indicator */}
        {condition.indicator === "BollingerBands" && (
          <>
            <div>
              <label className="text-xs text-gray-500 block mb-1">BB Period</label>
              <select
                value={condition.subfields?.["BB% Period"] || 20}
                onChange={(e) => handleChange("BB% Period", parseInt(e.target.value))}
                className="w-full border rounded px-2 py-1.5 text-sm"
              >
                {[10, 14, 20, 50, 100].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Deviation</label>
              <select
                value={condition.subfields?.Deviation || 2}
                onChange={(e) => handleChange("Deviation", parseFloat(e.target.value))}
                className="w-full border rounded px-2 py-1.5 text-sm"
              >
                {[1, 1.5, 2, 2.5, 3].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Condition</label>
              <select
                value={condition.subfields?.Condition || "Less Than"}
                onChange={(e) => handleChange("Condition", e.target.value)}
                className="w-full border rounded px-2 py-1.5 text-sm"
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">%B Value (0-1)</label>
              <input
                type="number"
                value={condition.subfields?.["Signal Value"] || 0}
                onChange={(e) => handleChange("Signal Value", parseFloat(e.target.value))}
                className="w-full border rounded px-2 py-1.5 text-sm"
                step={0.1}
                min={0}
                max={1}
              />
            </div>
          </>
        )}

        {/* Stochastic Indicator */}
        {condition.indicator === "Stochastic" && (
          <>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Stochastic Preset</label>
              <select
                value={condition.subfields?.["Stochastic Preset"] || "14,3,3"}
                onChange={(e) => handleChange("Stochastic Preset", e.target.value)}
                className="w-full border rounded px-2 py-1.5 text-sm"
              >
                {STOCHASTIC_PRESETS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">K Condition</label>
              <select
                value={condition.subfields?.["K Condition"] || "Less Than"}
                onChange={(e) => handleChange("K Condition", e.target.value)}
                className="w-full border rounded px-2 py-1.5 text-sm"
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">K Signal Value</label>
              <input
                type="number"
                value={condition.subfields?.["K Signal Value"] || 20}
                onChange={(e) => handleChange("K Signal Value", parseFloat(e.target.value))}
                className="w-full border rounded px-2 py-1.5 text-sm"
                min={0}
                max={100}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">K/D Crossover</label>
              <select
                value={condition.subfields?.Condition || ""}
                onChange={(e) => handleChange("Condition", e.target.value)}
                className="w-full border rounded px-2 py-1.5 text-sm"
              >
                <option value="">None</option>
                <option value="K Crossing Up D">K Crossing Up D</option>
                <option value="K Crossing Down D">K Crossing Down D</option>
              </select>
            </div>
          </>
        )}

        {/* Parabolic SAR Indicator */}
        {condition.indicator === "ParabolicSAR" && (
          <>
            <div>
              <label className="text-xs text-gray-500 block mb-1">PSAR Preset</label>
              <select
                value={condition.subfields?.["PSAR Preset"] || "0.02,0.2"}
                onChange={(e) => handleChange("PSAR Preset", e.target.value)}
                className="w-full border rounded px-2 py-1.5 text-sm"
              >
                {PSAR_PRESETS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-gray-500 block mb-1">Condition</label>
              <select
                value={condition.subfields?.Condition || "Crossing (Long)"}
                onChange={(e) => handleChange("Condition", e.target.value)}
                className="w-full border rounded px-2 py-1.5 text-sm"
              >
                <option value="Crossing (Long)">Crossing (Long) - Price crosses above SAR</option>
                <option value="Crossing (Short)">Crossing (Short) - Price crosses below SAR</option>
              </select>
            </div>
          </>
        )}

        {/* TradingView Signal */}
        {condition.indicator === "TradingView" && (
          <div className="md:col-span-3">
            <label className="text-xs text-gray-500 block mb-1">Signal Value</label>
            <select
              value={condition.subfields?.["Signal Value"] || "Buy"}
              onChange={(e) => handleChange("Signal Value", e.target.value)}
              className="w-full border rounded px-2 py-1.5 text-sm"
            >
              {TRADINGVIEW_SIGNALS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}

        {/* Heiken Ashi */}
        {condition.indicator === "HeikenAshi" && (
          <>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Condition</label>
              <select
                value={condition.subfields?.Condition || "Greater Than"}
                onChange={(e) => handleChange("Condition", e.target.value)}
                className="w-full border rounded px-2 py-1.5 text-sm"
              >
                <option value="Greater Than">Greater Than</option>
                <option value="Less Than">Less Than</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Signal Value</label>
              <input
                type="number"
                value={condition.subfields?.["Signal Value"] || 0}
                onChange={(e) => handleChange("Signal Value", parseFloat(e.target.value))}
                className="w-full border rounded px-2 py-1.5 text-sm"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function BacktestPage() {
  const { t } = useLanguage();
  const [strategyName, setStrategyName] = useState("My Strategy");
  const [selectedPairs, setSelectedPairs] = useState(["BTC/USDT"]);
  const [maxActiveDeals, setMaxActiveDeals] = useState(1);
  const [initialBalance, setInitialBalance] = useState(10000);
  const [baseOrderSize, setBaseOrderSize] = useState(100);
  const [tradingFee, setTradingFee] = useState(0.1); // 0.1%
  
  // Default to last 6 months
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 6);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  // === TAKE PROFIT SETTINGS (matching backtest2.py) ===
  const [priceChangeActive, setPriceChangeActive] = useState(true); // price_change_active
  const [targetProfit, setTargetProfit] = useState(5); // target_profit %
  const [takeProfitType, setTakeProfitType] = useState("percentage-total"); // take_profit_type
  const [trailingToggle, setTrailingToggle] = useState(false); // trailing_toggle
  const [trailingDeviation, setTrailingDeviation] = useState(1); // trailing_deviation %

  // === STOP LOSS SETTINGS (matching backtest2.py) ===
  const [stopLossToggle, setStopLossToggle] = useState(true); // stop_loss_toggle
  const [stopLossValue, setStopLossValue] = useState(3); // stop_loss_value %
  const [stopLossTimeout, setStopLossTimeout] = useState(0); // stop_loss_timeout (minutes)

  // === EXIT CONDITIONS (matching backtest2.py) ===
  const [conditionsActive, setConditionsActive] = useState(false); // conditions_active

  // === MINIMUM PROFIT (matching backtest2.py) ===
  const [minprofToggle, setMinprofToggle] = useState(false); // minprof_toggle
  const [minimalProfit, setMinimalProfit] = useState(1); // minimal_profit %

  // === SAFETY ORDERS / DCA (matching backtest2.py) ===
  const [safetyOrderToggle, setSafetyOrderToggle] = useState(false); // safety_order_toggle
  const [safetyOrderSize, setSafetyOrderSize] = useState(50); // safety_order_size
  const [priceDeviation, setPriceDeviation] = useState(2); // price_deviation %
  const [maxSafetyOrdersCount, setMaxSafetyOrdersCount] = useState(3); // max_safety_orders_count
  const [safetyOrderVolumeScale, setSafetyOrderVolumeScale] = useState(1.5); // safety_order_volume_scale
  const [safetyOrderStepScale, setSafetyOrderStepScale] = useState(1.0); // safety_order_step_scale

  // === OTHER SETTINGS (matching backtest2.py) ===
  const [reinvestProfit, setReinvestProfit] = useState(0); // reinvest_profit %
  const [riskReduction, setRiskReduction] = useState(0); // risk_reduction %
  const [minDailyVolume, setMinDailyVolume] = useState(0); // min_daily_volume
  const [cooldownBetweenDeals, setCooldownBetweenDeals] = useState(0); // cooldown_between_deals (minutes)
  const [closeDealAfterTimeout, setCloseDealAfterTimeout] = useState(0); // close_deal_after_timeout (minutes)

  // Market state mode
  const [useMarketState, setUseMarketState] = useState(false);

  // Conditions
  const [entryConditions, setEntryConditions] = useState([
    { indicator: "RSI", subfields: { Timeframe: "1m", Condition: "Less Than", "Signal Value": 30, "RSI Length": 14 } }
  ]);
  const [exitConditions, setExitConditions] = useState([
    { indicator: "RSI", subfields: { Timeframe: "1m", Condition: "Greater Than", "Signal Value": 70, "RSI Length": 14 } }
  ]);
  const [safetyConditions, setSafetyConditions] = useState([]);
  const [bullishEntryConditions, setBullishEntryConditions] = useState([]);
  const [bearishEntryConditions, setBearishEntryConditions] = useState([]);
  const [bullishExitConditions, setBullishExitConditions] = useState([]);
  const [bearishExitConditions, setBearishExitConditions] = useState([]);

  // Results
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const addCondition = (type) => {
    const newCondition = {
      indicator: "RSI",
      subfields: { Timeframe: "1m", Condition: "Less Than", "Signal Value": 30, "RSI Length": 14 }
    };
    switch (type) {
      case "entry":
        setEntryConditions([...entryConditions, newCondition]);
        break;
      case "exit":
        setExitConditions([...exitConditions, newCondition]);
        break;
      case "safety":
        setSafetyConditions([...safetyConditions, newCondition]);
        break;
      case "bullishEntry":
        setBullishEntryConditions([...bullishEntryConditions, newCondition]);
        break;
      case "bearishEntry":
        setBearishEntryConditions([...bearishEntryConditions, newCondition]);
        break;
      case "bullishExit":
        setBullishExitConditions([...bullishExitConditions, newCondition]);
        break;
      case "bearishExit":
        setBearishExitConditions([...bearishExitConditions, newCondition]);
        break;
    }
  };

  const saveStrategy = async () => {
    if (!results) return;
    setSaving(true);
    try {
      const config = {
        entry_conditions: useMarketState ? [] : entryConditions,
        exit_conditions: useMarketState ? [] : exitConditions,
        safety_conditions: safetyConditions,
        bullish_entry_conditions: useMarketState ? bullishEntryConditions : [],
        bearish_entry_conditions: useMarketState ? bearishEntryConditions : [],
        bullish_exit_conditions: useMarketState ? bullishExitConditions : [],
        bearish_exit_conditions: useMarketState ? bearishExitConditions : [],
        useMarketState,
        intervalMs: 60000,
        // All settings
        target_profit: targetProfit,
        stop_loss_value: stopLossValue,
        trailing_toggle: trailingToggle,
        trailing_deviation: trailingDeviation,
        safety_order_toggle: safetyOrderToggle,
        max_safety_orders_count: maxSafetyOrdersCount,
        price_deviation: priceDeviation,
        safety_order_volume_scale: safetyOrderVolumeScale,
      };

      const response = await apiFetch("/strategies/save", {
        method: "POST",
        body: {
          name: strategyName,
          description: `Strategy with ${results.metrics?.total_trades} trades, ${(results.metrics?.win_rate * 100).toFixed(0)}% win rate`,
          category: "Custom",
          config,
          pairs: selectedPairs,
          maxDeals: maxActiveDeals,
          orderSize: baseOrderSize,
          isPublic: true,
          backtestResults: {
            net_profit: results.metrics?.net_profit || 0,
            max_drawdown: results.metrics?.max_drawdown || 0,
            sharpe_ratio: results.metrics?.sharpe_ratio || 0,
            win_rate: results.metrics?.win_rate || 0,
          },
        },
      });
      
      if (response?.success) {
        setSaved(true);
        alert(`✓ Strategy "${strategyName}" saved successfully!\n\nView it on the Strategies page or Dashboard.`);
      } else if (response?.error) {
        throw new Error(response.error);
      } else {
        setSaved(true);
      }
    } catch (e) {
      console.error("Save error:", e);
      setError("Failed to save: " + e.message);
      alert("Failed to save strategy: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const runBacktest = async () => {
    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      // Build payload matching backtest2.py EXACTLY
      const payload = {
        strategy_name: strategyName,
        pairs: selectedPairs,
        max_active_deals: maxActiveDeals,
        initial_balance: initialBalance,
        base_order_size: baseOrderSize,
        trading_fee: tradingFee,
        start_date: startDate,
        end_date: endDate,
        
        // Entry/Exit conditions
        entry_conditions: useMarketState ? [] : entryConditions,
        exit_conditions: useMarketState ? [] : exitConditions,
        safety_conditions: safetyConditions,
        bullish_entry_conditions: useMarketState ? bullishEntryConditions : [],
        bearish_entry_conditions: useMarketState ? bearishEntryConditions : [],
        bullish_exit_conditions: useMarketState ? bullishExitConditions : [],
        bearish_exit_conditions: useMarketState ? bearishExitConditions : [],
        
        // Take Profit settings (backtest2.py names)
        price_change_active: priceChangeActive,
        target_profit: targetProfit,
        take_profit_type: takeProfitType,
        trailing_toggle: trailingToggle,
        trailing_deviation: trailingDeviation,
        
        // Exit condition toggle
        conditions_active: conditionsActive,
        
        // Minimum profit
        minprof_toggle: minprofToggle,
        minimal_profit: minimalProfit,
        
        // Stop Loss settings (backtest2.py names)
        stop_loss_toggle: stopLossToggle,
        stop_loss_value: stopLossValue,
        stop_loss_timeout: stopLossTimeout,
        
        // Safety Orders / DCA (backtest2.py names)
        safety_order_toggle: safetyOrderToggle,
        safety_order_size: safetyOrderSize,
        price_deviation: priceDeviation,
        max_safety_orders_count: maxSafetyOrdersCount,
        safety_order_volume_scale: safetyOrderVolumeScale,
        safety_order_step_scale: safetyOrderStepScale,
        
        // Other settings (backtest2.py names)
        reinvest_profit: reinvestProfit,
        risk_reduction: riskReduction,
        min_daily_volume: minDailyVolume,
        cooldown_between_deals: cooldownBetweenDeals,
        close_deal_after_timeout: closeDealAfterTimeout,
      };

      // Add to queue for proper backtest execution with backtest2.py on Contabo
      const queueResponse = await apiFetch("/backtest/queue", {
        method: "POST",
        body: {
          payload,
          notifyVia: 'email',
          notifyEmail: '',
        },
      });

      // Show success message and queue info
      setResults({
        status: 'queued',
        message: `Backtest added to queue! Position: #${queueResponse.queuePosition || 1}`,
        queueId: queueResponse.queueId,
        estimatedWait: queueResponse.estimatedWaitMinutes,
      });
      
      alert(`✅ Backtest queued!\n\nPosition: #${queueResponse.queuePosition || 1}\nEstimated wait: ${queueResponse.estimatedWaitMinutes || 10} minutes\n\nYou'll receive an email when it's complete. Watch the floating monitor for live progress!`);
      
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t("backtest.title")}</h1>
          <p className="text-gray-600 mt-1">{t("backtest.subtitle")}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Settings */}
          <Card>
            <CardHeader>
              <CardTitle>{t("backtest.strategySettings")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">
                    {t("backtest.strategyName")}
                    <InfoTooltip text="Give your strategy a unique name to identify it later in your dashboard and strategy list." />
                  </label>
                  <Input
                    value={strategyName}
                    onChange={(e) => setStrategyName(e.target.value)}
                    placeholder="My Strategy"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">{t("backtest.maxActiveDeals")}</label>
                  <Input
                    type="number"
                    value={maxActiveDeals}
                    onChange={(e) => setMaxActiveDeals(parseInt(e.target.value))}
                    min={1}
                    max={20}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">{t("backtest.initialBalance")}</label>
                  <Input
                    type="number"
                    value={initialBalance}
                    onChange={(e) => setInitialBalance(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">{t("backtest.baseOrderSize")}</label>
                  <Input
                    type="number"
                    value={baseOrderSize}
                    onChange={(e) => setBaseOrderSize(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Trading Fee (%)</label>
                  <Input
                    type="number"
                    value={tradingFee}
                    onChange={(e) => setTradingFee(parseFloat(e.target.value))}
                    step={0.01}
                    min={0}
                    max={1}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">{t("backtest.startDate")}</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">{t("backtest.endDate")}</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium block mb-2">{t("backtest.tradingPairs")}</label>
                <div className="flex flex-wrap gap-2">
                  {PAIRS.map((pair) => (
                    <button
                      key={pair}
                      onClick={() => {
                        if (selectedPairs.includes(pair)) {
                          setSelectedPairs(selectedPairs.filter((p) => p !== pair));
                        } else {
                          setSelectedPairs([...selectedPairs, pair]);
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-sm transition ${
                        selectedPairs.includes(pair)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {pair}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Take Profit Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Take Profit</span>
                <button
                  onClick={() => setPriceChangeActive(!priceChangeActive)}
                  className={`w-12 h-6 rounded-full transition ${
                    priceChangeActive ? "bg-green-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transform transition ${
                      priceChangeActive ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </CardTitle>
            </CardHeader>
            {priceChangeActive && (
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Target Profit (%)</label>
                    <Input
                      type="number"
                      value={targetProfit}
                      onChange={(e) => setTargetProfit(parseFloat(e.target.value))}
                      min={0.1}
                      step={0.1}
                    />
                    <p className="text-xs text-gray-500 mt-1">Close position at this profit %</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Take Profit Type</label>
                    <select
                      value={takeProfitType}
                      onChange={(e) => setTakeProfitType(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="percentage-total">% of Total Investment</option>
                      <option value="percentage-base">% of Base Order</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={trailingToggle}
                        onChange={(e) => setTrailingToggle(e.target.checked)}
                        className="rounded"
                      />
                      <label className="text-sm font-medium">Enable Trailing Take Profit</label>
                      {trailingToggle && (
                        <>
                          <Input
                            type="number"
                            value={trailingDeviation}
                            onChange={(e) => setTrailingDeviation(parseFloat(e.target.value))}
                            min={0.1}
                            step={0.1}
                            className="w-24"
                          />
                          <span className="text-sm text-gray-500">% deviation</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Stop Loss Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Stop Loss</span>
                <button
                  onClick={() => setStopLossToggle(!stopLossToggle)}
                  className={`w-12 h-6 rounded-full transition ${
                    stopLossToggle ? "bg-red-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transform transition ${
                      stopLossToggle ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </CardTitle>
            </CardHeader>
            {stopLossToggle && (
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Stop Loss (%)</label>
                    <Input
                      type="number"
                      value={stopLossValue}
                      onChange={(e) => setStopLossValue(parseFloat(e.target.value))}
                      min={0.1}
                      step={0.1}
                    />
                    <p className="text-xs text-gray-500 mt-1">Close position at this loss %</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Stop Loss Timeout (minutes)</label>
                    <Input
                      type="number"
                      value={stopLossTimeout}
                      onChange={(e) => setStopLossTimeout(parseInt(e.target.value))}
                      min={0}
                    />
                    <p className="text-xs text-gray-500 mt-1">0 = immediate, or wait X minutes before activating</p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Safety Orders (DCA) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  {t("backtest.safetyOrders")} (DCA)
                  <InfoTooltip text="Safety Orders (Dollar Cost Averaging) automatically buy more when price drops, lowering your average entry price. This helps turn losing positions into winners when price recovers." />
                </span>
                <button
                  onClick={() => setSafetyOrderToggle(!safetyOrderToggle)}
                  className={`w-12 h-6 rounded-full transition ${
                    safetyOrderToggle ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transform transition ${
                      safetyOrderToggle ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </CardTitle>
            </CardHeader>
            {safetyOrderToggle && (
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Safety Order Size ($)
                      <InfoTooltip text="Amount in USD for each safety order. Larger orders = faster recovery but more capital needed." />
                    </label>
                    <Input
                      type="number"
                      value={safetyOrderSize}
                      onChange={(e) => setSafetyOrderSize(parseFloat(e.target.value))}
                      min={1}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Max Safety Orders
                      <InfoTooltip text="Maximum number of safety orders per deal. More orders = can handle deeper dips but requires more capital. Common range: 1-7." />
                    </label>
                    <Input
                      type="number"
                      value={maxSafetyOrdersCount}
                      onChange={(e) => setMaxSafetyOrdersCount(parseInt(e.target.value))}
                      min={1}
                      max={20}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Price Deviation (%)
                      <InfoTooltip text="Price drop percentage to trigger the first safety order. Smaller = more frequent orders. Typical: 1-3%." />
                    </label>
                    <Input
                      type="number"
                      value={priceDeviation}
                      onChange={(e) => setPriceDeviation(parseFloat(e.target.value))}
                      min={0.5}
                      step={0.5}
                    />
                    <p className="text-xs text-gray-500 mt-1">% drop to trigger SO</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Volume Scale</label>
                    <Input
                      type="number"
                      value={safetyOrderVolumeScale}
                      onChange={(e) => setSafetyOrderVolumeScale(parseFloat(e.target.value))}
                      min={1}
                      step={0.1}
                    />
                    <p className="text-xs text-gray-500 mt-1">Multiply SO size each order</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Step Scale</label>
                    <Input
                      type="number"
                      value={safetyOrderStepScale}
                      onChange={(e) => setSafetyOrderStepScale(parseFloat(e.target.value))}
                      min={1}
                      step={0.1}
                    />
                    <p className="text-xs text-gray-500 mt-1">Multiply deviation each order</p>
                  </div>
                </div>

                {/* Safety Order Conditions */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-sm">Safety Order Conditions (Optional)</h4>
                    <Button size="sm" variant="outline" onClick={() => addCondition("safety")}>
                      + Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {safetyConditions.map((cond, i) => (
                      <ConditionBuilder
                        key={i}
                        condition={cond}
                        onChange={(updated) => {
                          const newConds = [...safetyConditions];
                          newConds[i] = updated;
                          setSafetyConditions(newConds);
                        }}
                        onRemove={() => setSafetyConditions(safetyConditions.filter((_, j) => j !== i))}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Advanced Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={minprofToggle}
                    onChange={(e) => setMinprofToggle(e.target.checked)}
                    className="rounded"
                  />
                  <label className="text-sm font-medium">Minimum Profit to Exit</label>
                  {minprofToggle && (
                    <>
                      <Input
                        type="number"
                        value={minimalProfit}
                        onChange={(e) => setMinimalProfit(parseFloat(e.target.value))}
                        className="w-20"
                        step={0.1}
                      />
                      <span className="text-sm text-gray-500">%</span>
                    </>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Reinvest Profit (%)</label>
                  <Input
                    type="number"
                    value={reinvestProfit}
                    onChange={(e) => setReinvestProfit(parseFloat(e.target.value))}
                    min={0}
                    max={100}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Risk Reduction (%)</label>
                  <Input
                    type="number"
                    value={riskReduction}
                    onChange={(e) => setRiskReduction(parseFloat(e.target.value))}
                    min={0}
                    max={100}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Min Daily Volume ($)</label>
                  <Input
                    type="number"
                    value={minDailyVolume}
                    onChange={(e) => setMinDailyVolume(parseFloat(e.target.value))}
                    min={0}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Cooldown Between Deals (min)</label>
                  <Input
                    type="number"
                    value={cooldownBetweenDeals}
                    onChange={(e) => setCooldownBetweenDeals(parseInt(e.target.value))}
                    min={0}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Close Deal After Timeout (min)</label>
                  <Input
                    type="number"
                    value={closeDealAfterTimeout}
                    onChange={(e) => setCloseDealAfterTimeout(parseInt(e.target.value))}
                    min={0}
                  />
                  <p className="text-xs text-gray-500 mt-1">0 = disabled</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exit Conditions Toggle */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Use Exit Conditions</h3>
                  <p className="text-sm text-gray-500">
                    Enable indicator-based exit instead of just TP/SL
                  </p>
                </div>
                <button
                  onClick={() => setConditionsActive(!conditionsActive)}
                  className={`w-12 h-6 rounded-full transition ${
                    conditionsActive ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transform transition ${
                      conditionsActive ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Entry Conditions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-green-600">{t("backtest.entryConditions")}</CardTitle>
              <Button size="sm" variant="outline" onClick={() => addCondition("entry")}>
                {t("backtest.addCondition")}
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {entryConditions.map((cond, i) => (
                <ConditionBuilder
                  key={i}
                  condition={cond}
                  onChange={(updated) => {
                    const newConds = [...entryConditions];
                    newConds[i] = updated;
                    setEntryConditions(newConds);
                  }}
                  onRemove={() => setEntryConditions(entryConditions.filter((_, j) => j !== i))}
                />
              ))}
              {entryConditions.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">
                  {t("backtest.noEntryConditions")}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Exit Conditions (only when conditionsActive) */}
          {conditionsActive && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-red-600">{t("backtest.exitConditions")}</CardTitle>
                <Button size="sm" variant="outline" onClick={() => addCondition("exit")}>
                  {t("backtest.addCondition")}
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {exitConditions.map((cond, i) => (
                  <ConditionBuilder
                    key={i}
                    condition={cond}
                    onChange={(updated) => {
                      const newConds = [...exitConditions];
                      newConds[i] = updated;
                      setExitConditions(newConds);
                    }}
                    onRemove={() => setExitConditions(exitConditions.filter((_, j) => j !== i))}
                  />
                ))}
                {exitConditions.length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-4">
                    {t("backtest.noExitConditions")}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Run Button */}
          <Button
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={runBacktest}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t("backtest.runningBacktest")}
              </>
            ) : (
              <>
                🚀 {t("backtest.runBacktest")}
              </>
            )}
          </Button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {results ? (
            <>
              {/* Queue Status */}
              {results.status === 'queued' && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-4xl mb-3">⏳</div>
                      <h3 className="font-bold text-lg text-blue-800">Backtest Queued</h3>
                      <p className="text-blue-600 mt-2">{results.message}</p>
                      {results.estimatedWait && (
                        <p className="text-sm text-blue-500 mt-2">
                          Estimated wait: ~{results.estimatedWait} minutes
                        </p>
                      )}
                      <p className="text-xs text-blue-400 mt-4">
                        Check the floating monitor in the corner for live updates!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Performance Metrics */}
              {results.metrics && (
                <>
                  <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{t("backtest.likeResults")}</h3>
                          <p className="text-blue-100 text-sm">{t("backtest.saveToRunLive")}</p>
                        </div>
                        <Button
                          onClick={saveStrategy}
                          disabled={saving || saved}
                          className="bg-white text-blue-600 hover:bg-blue-50"
                        >
                          {saving ? t("backtest.saving") : saved ? t("backtest.saved") : t("backtest.saveStrategy")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t("backtest.performanceMetrics")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-xs text-green-600 font-medium">{t("backtest.netProfit")}</p>
                          <p className="text-xl font-bold text-green-700">{(results.metrics?.net_profit * 100).toFixed(1)}%</p>
                          <p className="text-sm text-green-600">{results.metrics?.net_profit_usd}</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-3">
                          <p className="text-xs text-red-600 font-medium">{t("backtest.maxDrawdown")}</p>
                          <p className="text-xl font-bold text-red-700">{(results.metrics?.max_drawdown * 100).toFixed(1)}%</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-xs text-blue-600 font-medium">{t("strategies.sharpeRatio")}</p>
                          <p className="text-xl font-bold text-blue-700">{results.metrics?.sharpe_ratio?.toFixed(2)}</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3">
                          <p className="text-xs text-purple-600 font-medium">{t("strategies.winRate")}</p>
                          <p className="text-xl font-bold text-purple-700">{(results.metrics?.win_rate * 100).toFixed(0)}%</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600 font-medium">{t("backtest.totalTrades")}</p>
                          <p className="text-xl font-bold">{results.metrics?.total_trades}</p>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-3">
                          <p className="text-xs text-yellow-600 font-medium">{t("backtest.profitFactor")}</p>
                          <p className="text-xl font-bold text-yellow-700">{results.metrics?.profit_factor}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Equity Curve */}
              {results.chartData && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t("backtest.equityCurve")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={results.chartData.timestamps.map((t, i) => ({
                            date: formatDate(t),
                            balance: results.chartData.unrealized_balance?.[i] || results.chartData.balance?.[i],
                          }))}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="balance"
                            stroke="#2563eb"
                            fill="#3b82f6"
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="font-medium text-lg mb-2">{t("backtest.noResultsYet")}</h3>
                <p className="text-gray-500 text-sm">
                  {t("backtest.configureToSee")}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
