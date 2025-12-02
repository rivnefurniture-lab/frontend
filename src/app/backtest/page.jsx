"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { apiFetch } from "@/lib/api";
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

const INDICATORS = [
  { id: "RSI", name: "RSI (Relative Strength Index)" },
  { id: "MA", name: "Moving Average Crossover" },
  { id: "MACD", name: "MACD" },
  { id: "BollingerBands", name: "Bollinger Bands %B" },
];

const TIMEFRAMES = ["1m", "5m", "15m", "1h", "4h", "1d"];
const CONDITIONS = ["Less Than", "Greater Than", "Crossing Up", "Crossing Down"];
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
          onChange={(e) => onChange({ ...condition, indicator: e.target.value })}
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
            value={condition.subfields?.Timeframe || "1h"}
            onChange={(e) => handleChange("Timeframe", e.target.value)}
            className="w-full border rounded px-2 py-1.5 text-sm"
          >
            {TIMEFRAMES.map((tf) => (
              <option key={tf} value={tf}>{tf}</option>
            ))}
          </select>
        </div>

        {condition.indicator === "RSI" && (
          <>
            <div>
              <label className="text-xs text-gray-500 block mb-1">RSI Length</label>
              <input
                type="number"
                value={condition.subfields?.["RSI Length"] || 14}
                onChange={(e) => handleChange("RSI Length", parseInt(e.target.value))}
                className="w-full border rounded px-2 py-1.5 text-sm"
                min={2}
                max={100}
              />
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
                <option value="WMA">WMA</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Fast MA</label>
              <input
                type="number"
                value={condition.subfields?.["Fast MA"] || 20}
                onChange={(e) => handleChange("Fast MA", parseInt(e.target.value))}
                className="w-full border rounded px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Slow MA</label>
              <input
                type="number"
                value={condition.subfields?.["Slow MA"] || 50}
                onChange={(e) => handleChange("Slow MA", parseInt(e.target.value))}
                className="w-full border rounded px-2 py-1.5 text-sm"
              />
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

        {condition.indicator === "MACD" && (
          <>
            <div>
              <label className="text-xs text-gray-500 block mb-1">MACD Preset</label>
              <select
                value={condition.subfields?.["MACD Preset"] || "12,26,9"}
                onChange={(e) => handleChange("MACD Preset", e.target.value)}
                className="w-full border rounded px-2 py-1.5 text-sm"
              >
                <option value="12,26,9">12, 26, 9 (Standard)</option>
                <option value="8,17,9">8, 17, 9 (Fast)</option>
                <option value="5,35,5">5, 35, 5 (Slow)</option>
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

        {condition.indicator === "BollingerBands" && (
          <>
            <div>
              <label className="text-xs text-gray-500 block mb-1">BB Period</label>
              <input
                type="number"
                value={condition.subfields?.["BB% Period"] || 20}
                onChange={(e) => handleChange("BB% Period", parseInt(e.target.value))}
                className="w-full border rounded px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Deviation</label>
              <input
                type="number"
                value={condition.subfields?.Deviation || 2}
                onChange={(e) => handleChange("Deviation", parseFloat(e.target.value))}
                className="w-full border rounded px-2 py-1.5 text-sm"
                step={0.5}
              />
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
              <label className="text-xs text-gray-500 block mb-1">%B Value</label>
              <input
                type="number"
                value={condition.subfields?.["Signal Value"] || 0}
                onChange={(e) => handleChange("Signal Value", parseFloat(e.target.value))}
                className="w-full border rounded px-2 py-1.5 text-sm"
                step={0.1}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function BacktestPage() {
  const [strategyName, setStrategyName] = useState("My Strategy");
  const [selectedPairs, setSelectedPairs] = useState(["BTC/USDT", "ETH/USDT", "SOL/USDT"]);
  const [maxActiveDeals, setMaxActiveDeals] = useState(5);
  const [initialBalance, setInitialBalance] = useState(5000);
  const [baseOrderSize, setBaseOrderSize] = useState(1000);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Market state mode
  const [useMarketState, setUseMarketState] = useState(false);

  // Conditions
  const [entryConditions, setEntryConditions] = useState([
    { indicator: "RSI", subfields: { Timeframe: "1h", Condition: "Less Than", "Signal Value": 30, "RSI Length": 14 } }
  ]);
  const [exitConditions, setExitConditions] = useState([
    { indicator: "RSI", subfields: { Timeframe: "1h", Condition: "Greater Than", "Signal Value": 70, "RSI Length": 14 } }
  ]);
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
      subfields: { Timeframe: "1h", Condition: "Less Than", "Signal Value": 30, "RSI Length": 14 }
    };
    switch (type) {
      case "entry":
        setEntryConditions([...entryConditions, newCondition]);
        break;
      case "exit":
        setExitConditions([...exitConditions, newCondition]);
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
        bullish_entry_conditions: useMarketState ? bullishEntryConditions : [],
        bearish_entry_conditions: useMarketState ? bearishEntryConditions : [],
        bullish_exit_conditions: useMarketState ? bullishExitConditions : [],
        bearish_exit_conditions: useMarketState ? bearishExitConditions : [],
        useMarketState,
        intervalMs: 60000, // Check every minute
      };

      await apiFetch("/strategies/save", {
        method: "POST",
        body: JSON.stringify({
          name: strategyName,
          description: `Strategy with ${results.metrics?.total_trades} trades, ${results.metrics?.win_rate}% win rate`,
          category: "Custom",
          config,
          pairs: selectedPairs,
          maxDeals: maxActiveDeals,
          orderSize: baseOrderSize,
          backtestResults: {
            net_profit: results.metrics?.net_profit || 0,
            max_drawdown: results.metrics?.max_drawdown || 0,
            sharpe_ratio: results.metrics?.sharpe_ratio || 0,
            win_rate: results.metrics?.win_rate || 0,
          },
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 5000);
    } catch (e) {
      setError("Failed to save: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const runBacktest = async () => {
    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      const payload = {
        strategy_name: strategyName,
        pairs: selectedPairs,
        max_active_deals: maxActiveDeals,
        initial_balance: initialBalance,
        base_order_size: baseOrderSize,
        start_date: startDate,
        end_date: endDate,
        entry_conditions: useMarketState ? [] : entryConditions,
        exit_conditions: useMarketState ? [] : exitConditions,
        bullish_entry_conditions: useMarketState ? bullishEntryConditions : [],
        bearish_entry_conditions: useMarketState ? bearishEntryConditions : [],
        bullish_exit_conditions: useMarketState ? bullishExitConditions : [],
        bearish_exit_conditions: useMarketState ? bearishExitConditions : [],
      };

      const result = await apiFetch("/backtest/demo", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setResults(result);
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
          <h1 className="text-3xl font-bold">Strategy Backtest</h1>
          <p className="text-gray-600 mt-1">Build, test, and optimize your trading strategies</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Strategy Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Strategy Name</label>
                  <Input
                    value={strategyName}
                    onChange={(e) => setStrategyName(e.target.value)}
                    placeholder="My Strategy"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Max Active Deals</label>
                  <Input
                    type="number"
                    value={maxActiveDeals}
                    onChange={(e) => setMaxActiveDeals(parseInt(e.target.value))}
                    min={1}
                    max={20}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Initial Balance ($)</label>
                  <Input
                    type="number"
                    value={initialBalance}
                    onChange={(e) => setInitialBalance(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Base Order Size ($)</label>
                  <Input
                    type="number"
                    value={baseOrderSize}
                    onChange={(e) => setBaseOrderSize(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Start Date</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">End Date</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium block mb-2">Trading Pairs</label>
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

          {/* Market State Toggle */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Use Market State Conditions</h3>
                  <p className="text-sm text-gray-500">
                    Enable separate bullish/bearish conditions based on BTC market state
                  </p>
                </div>
                <button
                  onClick={() => setUseMarketState(!useMarketState)}
                  className={`w-12 h-6 rounded-full transition ${
                    useMarketState ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transform transition ${
                      useMarketState ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Simple Mode: Entry/Exit Conditions */}
          {!useMarketState && (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-green-600">Entry Conditions</CardTitle>
                  <Button size="sm" variant="outline" onClick={() => addCondition("entry")}>
                    + Add Condition
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
                      No entry conditions. Add one to start.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-red-600">Exit Conditions</CardTitle>
                  <Button size="sm" variant="outline" onClick={() => addCondition("exit")}>
                    + Add Condition
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
                      No exit conditions. Add one to complete your strategy.
                    </p>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {/* Market State Mode: Bullish/Bearish Conditions */}
          {useMarketState && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Bullish Conditions */}
              <div className="space-y-4">
                <Card className="border-green-200 bg-green-50/30">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-green-700 text-lg">🐂 Bullish Entry</CardTitle>
                    <Button size="sm" variant="outline" onClick={() => addCondition("bullishEntry")}>
                      + Add
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {bullishEntryConditions.map((cond, i) => (
                      <ConditionBuilder
                        key={i}
                        condition={cond}
                        onChange={(updated) => {
                          const newConds = [...bullishEntryConditions];
                          newConds[i] = updated;
                          setBullishEntryConditions(newConds);
                        }}
                        onRemove={() => setBullishEntryConditions(bullishEntryConditions.filter((_, j) => j !== i))}
                      />
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50/30">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-green-700 text-lg">🐂 Bullish Exit</CardTitle>
                    <Button size="sm" variant="outline" onClick={() => addCondition("bullishExit")}>
                      + Add
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {bullishExitConditions.map((cond, i) => (
                      <ConditionBuilder
                        key={i}
                        condition={cond}
                        onChange={(updated) => {
                          const newConds = [...bullishExitConditions];
                          newConds[i] = updated;
                          setBullishExitConditions(newConds);
                        }}
                        onRemove={() => setBullishExitConditions(bullishExitConditions.filter((_, j) => j !== i))}
                      />
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Bearish Conditions */}
              <div className="space-y-4">
                <Card className="border-red-200 bg-red-50/30">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-red-700 text-lg">🐻 Bearish Entry</CardTitle>
                    <Button size="sm" variant="outline" onClick={() => addCondition("bearishEntry")}>
                      + Add
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {bearishEntryConditions.map((cond, i) => (
                      <ConditionBuilder
                        key={i}
                        condition={cond}
                        onChange={(updated) => {
                          const newConds = [...bearishEntryConditions];
                          newConds[i] = updated;
                          setBearishEntryConditions(newConds);
                        }}
                        onRemove={() => setBearishEntryConditions(bearishEntryConditions.filter((_, j) => j !== i))}
                      />
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50/30">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-red-700 text-lg">🐻 Bearish Exit</CardTitle>
                    <Button size="sm" variant="outline" onClick={() => addCondition("bearishExit")}>
                      + Add
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {bearishExitConditions.map((cond, i) => (
                      <ConditionBuilder
                        key={i}
                        condition={cond}
                        onChange={(updated) => {
                          const newConds = [...bearishExitConditions];
                          newConds[i] = updated;
                          setBearishExitConditions(newConds);
                        }}
                        onRemove={() => setBearishExitConditions(bearishExitConditions.filter((_, j) => j !== i))}
                      />
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
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
                Running Backtest...
              </>
            ) : (
              "🚀 Run Backtest"
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
              {/* Save Strategy Button */}
              <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">Like these results?</h3>
                      <p className="text-blue-100 text-sm">Save this strategy to run it live</p>
                    </div>
                    <Button
                      onClick={saveStrategy}
                      disabled={saving || saved}
                      className="bg-white text-blue-600 hover:bg-blue-50"
                    >
                      {saving ? "Saving..." : saved ? "✓ Saved!" : "💾 Save Strategy"}
                    </Button>
                  </div>
                  {saved && (
                    <p className="text-blue-100 text-sm mt-2">
                      ✓ Strategy saved! Go to <a href="/dashboard" className="underline">Dashboard</a> to start trading.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs text-green-600 font-medium">Net Profit</p>
                      <p className="text-xl font-bold text-green-700">{results.metrics?.net_profit}%</p>
                      <p className="text-sm text-green-600">{results.metrics?.net_profit_usd}</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-xs text-red-600 font-medium">Max Drawdown</p>
                      <p className="text-xl font-bold text-red-700">{results.metrics?.max_drawdown}%</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-blue-600 font-medium">Sharpe Ratio</p>
                      <p className="text-xl font-bold text-blue-700">{results.metrics?.sharpe_ratio}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-xs text-purple-600 font-medium">Win Rate</p>
                      <p className="text-xl font-bold text-purple-700">{results.metrics?.win_rate}%</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 font-medium">Total Trades</p>
                      <p className="text-xl font-bold">{results.metrics?.total_trades}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-3">
                      <p className="text-xs text-yellow-600 font-medium">Profit Factor</p>
                      <p className="text-xl font-bold text-yellow-700">{results.metrics?.profit_factor}</p>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-3">
                      <p className="text-xs text-indigo-600 font-medium">Sortino Ratio</p>
                      <p className="text-xl font-bold text-indigo-700">{results.metrics?.sortino_ratio}</p>
                    </div>
                    <div className="bg-teal-50 rounded-lg p-3">
                      <p className="text-xs text-teal-600 font-medium">Yearly Return</p>
                      <p className="text-xl font-bold text-teal-700">{results.metrics?.yearly_return}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Equity Curve */}
              {results.chartData && (
                <Card>
                  <CardHeader>
                    <CardTitle>Equity Curve</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={results.chartData.timestamps.map((t, i) => ({
                            date: formatDate(t),
                            balance: results.chartData.balance[i],
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

              {/* Drawdown Chart */}
              {results.chartData && (
                <Card>
                  <CardHeader>
                    <CardTitle>Drawdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={results.chartData.timestamps.map((t, i) => ({
                            date: formatDate(t),
                            drawdown: -results.chartData.drawdown[i],
                          }))}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="drawdown"
                            stroke="#dc2626"
                            fill="#ef4444"
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
                <div className="text-6xl mb-4">📊</div>
                <h3 className="font-medium text-lg mb-2">No Results Yet</h3>
                <p className="text-gray-500 text-sm">
                  Configure your strategy and run a backtest to see results here.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

