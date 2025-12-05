"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
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
  const { t } = useLanguage();
  const [strategyName, setStrategyName] = useState("My Strategy");
  const [selectedPairs, setSelectedPairs] = useState(["BTC/USDT", "ETH/USDT", "SOL/USDT"]);
  const [maxActiveDeals, setMaxActiveDeals] = useState(5);
  const [initialBalance, setInitialBalance] = useState(5000);
  const [baseOrderSize, setBaseOrderSize] = useState(1000);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Risk Management
  const [takeProfit, setTakeProfit] = useState(5); // 5%
  const [stopLoss, setStopLoss] = useState(3); // 3%
  const [trailingStop, setTrailingStop] = useState(false);
  const [trailingStopPercent, setTrailingStopPercent] = useState(1);
  
  // Safety Orders (DCA)
  const [useSafetyOrders, setUseSafetyOrders] = useState(false);
  const [safetyOrdersCount, setSafetyOrdersCount] = useState(3);
  const [safetyOrderDeviation, setSafetyOrderDeviation] = useState(2); // Price deviation %
  const [safetyOrderVolumeScale, setSafetyOrderVolumeScale] = useState(1.5);

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
        intervalMs: 60000,
        // Risk management
        takeProfit,
        stopLoss,
        trailingStop,
        trailingStopPercent,
        // Safety orders
        useSafetyOrders,
        safetyOrdersCount,
        safetyOrderDeviation,
        safetyOrderVolumeScale,
      };

      const response = await apiFetch("/strategies/save", {
        method: "POST",
        body: {
          name: strategyName,
          description: `Strategy with ${results.metrics?.total_trades} trades, ${results.metrics?.win_rate}% win rate`,
          category: "Custom",
          config,
          pairs: selectedPairs,
          maxDeals: maxActiveDeals,
          orderSize: baseOrderSize,
          isPublic: true, // Make strategy visible in strategies list
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

  // Export trades as CSV
  const exportTradesCSV = () => {
    if (!results?.trades?.length) return;
    
    const headers = ["DateTime", "Pair", "Action", "Price", "Size", "P&L %", "P&L USD", "Balance", "Drawdown", "Reason", "Indicators"];
    const rows = results.trades.map(t => {
      // Format date/time
      const dateValue = t.timestamp || t.date || t.time || t.createdAt;
      let dateStr = '';
      try {
        const d = new Date(dateValue);
        dateStr = !isNaN(d.getTime()) ? d.toISOString() : (dateValue || '');
      } catch {
        dateStr = dateValue || '';
      }
      
      return [
        dateStr,
        t.symbol || t.pair || '',
        t.action || t.side || '',
        t.price?.toFixed(2) || '',
        t.size || t.quantity || t.amount || '',
        (t.profit_percent || t.pnl_percent || 0).toFixed(2),
        (t.profit_usd || t.pnl_usd || 0).toFixed(2),
        (t.equity || t.balance || 0).toFixed(2),
        (t.drawdown || 0).toFixed(2),
        '"' + (t.reason || t.comment || t.trigger || '').replace(/"/g, "'") + '"',
        '"' + (t.indicatorProof || []).map(function(p) { return p.indicator + ': ' + p.value + ' ' + p.condition + ' ' + p.target; }).join('; ') + '"'
      ];
    });
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${strategyName.replace(/\s+/g, '_')}_trades_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper to format trade date/time
  const formatTradeDateTime = (trade) => {
    // Try various date field names
    const dateValue = trade.timestamp || trade.date || trade.time || trade.createdAt;
    if (!dateValue) return '-';
    
    try {
      const d = new Date(dateValue);
      if (isNaN(d.getTime())) return dateValue;
      return d.toLocaleString('uk-UA', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateValue;
    }
  };

  // Export trades as PDF report
  const exportTradesPDF = () => {
    if (!results?.trades?.length) return;
    
    // Generate HTML for print
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Algotcha Trade Report - ${strategyName}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px; }
          .logo { font-size: 32px; font-weight: bold; color: #2563eb; }
          .subtitle { color: #666; margin-top: 5px; }
          .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 30px 0; }
          .metric { padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: center; }
          .metric-value { font-size: 24px; font-weight: bold; }
          .metric-value.profit { color: #16a34a; }
          .metric-value.loss { color: #dc2626; }
          .metric-label { font-size: 12px; color: #666; }
          .strategy-info { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .strategy-info h3 { margin: 0 0 10px 0; color: #1e40af; }
          .strategy-info p { margin: 5px 0; color: #334155; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
          th, td { padding: 8px 6px; text-align: left; border-bottom: 1px solid #e5e7eb; }
          th { background: #f1f5f9; font-weight: 600; color: #475569; }
          .profit { color: #16a34a; font-weight: 600; }
          .loss { color: #dc2626; font-weight: 600; }
          .buy { color: #16a34a; font-weight: bold; }
          .sell { color: #dc2626; font-weight: bold; }
          .footer { margin-top: 40px; text-align: center; color: #999; font-size: 11px; border-top: 1px solid #eee; padding-top: 20px; }
          .indicator-proof { background: #fefce8; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .indicator-proof h3 { margin: 0 0 10px 0; color: #854d0e; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">📊 Algotcha</div>
          <div class="subtitle">Professional Trade Report</div>
        </div>
        
        <h1>${strategyName}</h1>
        <p>Generated: ${new Date().toLocaleString('uk-UA')}</p>
        <p>Period: ${startDate} to ${endDate}</p>
        
        <div class="strategy-info">
          <h3>Strategy Configuration</h3>
          <p><strong>Trading Pairs:</strong> ${selectedPairs.join(', ')}</p>
          <p><strong>Initial Balance:</strong> $${initialBalance.toLocaleString()}</p>
          <p><strong>Base Order Size:</strong> $${baseOrderSize}</p>
          <p><strong>Max Active Deals:</strong> ${maxActiveDeals}</p>
          <p><strong>Take Profit:</strong> ${takeProfit}% | <strong>Stop Loss:</strong> ${stopLoss}%</p>
        </div>
        
        <div class="metrics">
          <div class="metric">
            <div class="metric-value ${(results.metrics?.net_profit || 0) >= 0 ? 'profit' : 'loss'}">${results.metrics?.net_profit || 0}%</div>
            <div class="metric-label">Net Profit</div>
          </div>
          <div class="metric">
            <div class="metric-value">${results.metrics?.win_rate || 0}%</div>
            <div class="metric-label">Win Rate</div>
          </div>
          <div class="metric">
            <div class="metric-value">${results.metrics?.total_trades || 0}</div>
            <div class="metric-label">Total Trades</div>
          </div>
          <div class="metric">
            <div class="metric-value">${results.metrics?.sharpe_ratio || 0}</div>
            <div class="metric-label">Sharpe Ratio</div>
          </div>
        </div>

        <div class="metrics">
          <div class="metric">
            <div class="metric-value loss">-${results.metrics?.max_drawdown || 0}%</div>
            <div class="metric-label">Max Drawdown</div>
          </div>
          <div class="metric">
            <div class="metric-value">${results.metrics?.profit_factor || 0}</div>
            <div class="metric-label">Profit Factor</div>
          </div>
          <div class="metric">
            <div class="metric-value">${results.metrics?.sortino_ratio || 0}</div>
            <div class="metric-label">Sortino Ratio</div>
          </div>
          <div class="metric">
            <div class="metric-value profit">+${results.metrics?.yearly_return || 0}%</div>
            <div class="metric-label">Yearly Return</div>
          </div>
        </div>
        
        <h2>Trade History (${results.trades.length} trades)</h2>
        <table>
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Pair</th>
              <th>Action</th>
              <th>Price</th>
              <th>Size</th>
              <th>P&L %</th>
              <th>P&L $</th>
              <th>Balance</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            ${results.trades.map(t => {
              const pnlPercent = t.profit_percent || t.pnl_percent || t.pnl || 0;
              const pnlUsd = t.profit_usd || t.pnl_usd || 0;
              const action = t.action || t.side || 'BUY';
              const equity = t.equity || t.balance || t.total || 0;
              const size = t.size || t.quantity || t.amount || 0;
              return `
              <tr>
                <td>${formatTradeDateTime(t)}</td>
                <td><strong>${t.symbol || t.pair || '-'}</strong></td>
                <td class="${action.toUpperCase() === 'BUY' ? 'buy' : 'sell'}">${action.toUpperCase()}</td>
                <td>$${(t.price || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td>${typeof size === 'number' ? size.toFixed(6) : size}</td>
                <td class="${pnlPercent >= 0 ? 'profit' : 'loss'}">
                  ${pnlPercent >= 0 ? '+' : ''}${pnlPercent.toFixed(2)}%
                </td>
                <td class="${pnlUsd >= 0 ? 'profit' : 'loss'}">
                  ${pnlUsd >= 0 ? '+' : ''}$${pnlUsd.toFixed(2)}
                </td>
                <td>$${equity.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</td>
                <td style="font-size: 10px; max-width: 150px;">${t.reason || t.comment || t.trigger || '-'}</td>
              </tr>
            `}).join('')}
          </tbody>
        </table>
        
        <div class="indicator-proof">
          <h3>Indicator-Based Trading</h3>
          <p style="font-size: 11px; color: #666;">
            All trades were executed based on technical indicator conditions configured in your strategy.
            The backtest uses real historical price data from Binance to ensure accuracy.
          </p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} Algotcha. All rights reserved.</p>
          <p>Past performance does not guarantee future results. Trading involves risk.</p>
          <p style="margin-top: 10px;">Report generated at ${new Date().toISOString()}</p>
        </div>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
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
        // Indicator conditions
        entry_conditions: useMarketState ? [] : entryConditions,
        exit_conditions: useMarketState ? [] : exitConditions,
        bullish_entry_conditions: useMarketState ? bullishEntryConditions : [],
        bearish_entry_conditions: useMarketState ? bearishEntryConditions : [],
        bullish_exit_conditions: useMarketState ? bullishExitConditions : [],
        bearish_exit_conditions: useMarketState ? bearishExitConditions : [],
        // Risk management
        take_profit: takeProfit,
        stop_loss: stopLoss,
        trailing_stop: trailingStop,
        trailing_stop_percent: trailingStopPercent,
        // Safety orders
        use_safety_orders: useSafetyOrders,
        safety_orders_count: safetyOrdersCount,
        safety_order_deviation: safetyOrderDeviation,
        safety_order_volume_scale: safetyOrderVolumeScale,
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
                  <label className="text-sm font-medium block mb-1">{t("backtest.strategyName")}</label>
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

          {/* Risk Management */}
          <Card>
            <CardHeader>
              <CardTitle>{t("backtest.riskManagement")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">{t("backtest.takeProfit")}</label>
                  <Input
                    type="number"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(parseFloat(e.target.value))}
                    min={0.1}
                    step={0.1}
                  />
                  <p className="text-xs text-gray-500 mt-1">{t("backtest.takeProfitDesc")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">{t("backtest.stopLoss")}</label>
                  <Input
                    type="number"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(parseFloat(e.target.value))}
                    min={0.1}
                    step={0.1}
                  />
                  <p className="text-xs text-gray-500 mt-1">{t("backtest.stopLossDesc")}</p>
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={trailingStop}
                      onChange={(e) => setTrailingStop(e.target.checked)}
                      className="rounded"
                    />
                    <label className="text-sm font-medium">{t("backtest.enableTrailingStop")}</label>
                    {trailingStop && (
                      <Input
                        type="number"
                        value={trailingStopPercent}
                        onChange={(e) => setTrailingStopPercent(parseFloat(e.target.value))}
                        min={0.1}
                        step={0.1}
                        className="w-24"
                      />
                    )}
                    {trailingStop && <span className="text-sm text-gray-500">%</span>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety Orders (DCA) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t("backtest.safetyOrders")}</span>
                <button
                  onClick={() => setUseSafetyOrders(!useSafetyOrders)}
                  className={`w-12 h-6 rounded-full transition ${
                    useSafetyOrders ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transform transition ${
                      useSafetyOrders ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </CardTitle>
            </CardHeader>
            {useSafetyOrders && (
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">{t("backtest.numSafetyOrders")}</label>
                    <Input
                      type="number"
                      value={safetyOrdersCount}
                      onChange={(e) => setSafetyOrdersCount(parseInt(e.target.value))}
                      min={1}
                      max={10}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">{t("backtest.priceDeviation")}</label>
                    <Input
                      type="number"
                      value={safetyOrderDeviation}
                      onChange={(e) => setSafetyOrderDeviation(parseFloat(e.target.value))}
                      min={0.5}
                      step={0.5}
                    />
                    <p className="text-xs text-gray-500 mt-1">{t("backtest.priceDeviationDesc")}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">{t("backtest.volumeScale")}</label>
                    <Input
                      type="number"
                      value={safetyOrderVolumeScale}
                      onChange={(e) => setSafetyOrderVolumeScale(parseFloat(e.target.value))}
                      min={1}
                      step={0.1}
                    />
                    <p className="text-xs text-gray-500 mt-1">{t("backtest.volumeScaleDesc")}</p>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                  <strong>DCA Strategy:</strong> If price drops {safetyOrderDeviation}%, place safety order at {safetyOrderVolumeScale}x base size.
                  Max {safetyOrdersCount} safety orders.
                </div>
              </CardContent>
            )}
          </Card>

          {/* Market State Toggle */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{t("backtest.marketStateConditions")}</h3>
                  <p className="text-sm text-gray-500">
                    {t("backtest.marketStateDesc")}
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
                {t("backtest.runningBacktest")}
              </>
            ) : (
              t("backtest.runBacktest")
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
                  {saved && (
                    <p className="text-blue-100 text-sm mt-2">
                      ✓ Strategy saved! Go to <a href="/strategies" className="underline">Strategies</a> to view or <a href="/dashboard" className="underline">Dashboard</a> to start trading.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Export Trades */}
              {results.trades?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Export Trade Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      <Button onClick={exportTradesCSV} variant="outline" className="flex-1">
                        📥 Download CSV
                      </Button>
                      <Button onClick={exportTradesPDF} variant="outline" className="flex-1">
                        📄 Print PDF Report
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Export {results.trades.length} trades for your records
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>{t("backtest.performanceMetrics")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs text-green-600 font-medium">{t("backtest.netProfit")}</p>
                      <p className="text-xl font-bold text-green-700">{results.metrics?.net_profit}%</p>
                      <p className="text-sm text-green-600">{results.metrics?.net_profit_usd}</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-xs text-red-600 font-medium">{t("backtest.maxDrawdown")}</p>
                      <p className="text-xl font-bold text-red-700">{results.metrics?.max_drawdown}%</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-blue-600 font-medium">{t("strategies.sharpeRatio")}</p>
                      <p className="text-xl font-bold text-blue-700">{results.metrics?.sharpe_ratio}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-xs text-purple-600 font-medium">{t("strategies.winRate")}</p>
                      <p className="text-xl font-bold text-purple-700">{results.metrics?.win_rate}%</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 font-medium">{t("backtest.totalTrades")}</p>
                      <p className="text-xl font-bold">{results.metrics?.total_trades}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-3">
                      <p className="text-xs text-yellow-600 font-medium">{t("backtest.profitFactor")}</p>
                      <p className="text-xl font-bold text-yellow-700">{results.metrics?.profit_factor}</p>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-3">
                      <p className="text-xs text-indigo-600 font-medium">{t("backtest.sortinoRatio")}</p>
                      <p className="text-xl font-bold text-indigo-700">{results.metrics?.sortino_ratio}</p>
                    </div>
                    <div className="bg-teal-50 rounded-lg p-3">
                      <p className="text-xs text-teal-600 font-medium">{t("backtest.yearlyReturn")}</p>
                      <p className="text-xl font-bold text-teal-700">{results.metrics?.yearly_return}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                    <CardTitle>{t("backtest.drawdown")}</CardTitle>
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

              {/* Trades Table with Full Details */}
              {results.trades?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{t("backtest.tradeHistory")} ({results.trades.length})</span>
                      <span className="text-xs font-normal text-gray-500">
                        {t("backtest.transparency")}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr className="text-left text-xs text-gray-600">
                            <th className="p-2 font-medium">Date & Time</th>
                            <th className="p-2 font-medium">Pair</th>
                            <th className="p-2 font-medium">Action</th>
                            <th className="p-2 font-medium">Price</th>
                            <th className="p-2 font-medium">P&L</th>
                            <th className="p-2 font-medium">Equity</th>
                            <th className="p-2 font-medium">DD</th>
                            <th className="p-2 font-medium">Reason</th>
                            <th className="p-2 font-medium">Indicator Proof</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.trades.slice(0, 50).map((trade, idx) => {
                            // Format trade date
                            const dateValue = trade.timestamp || trade.date || trade.time || trade.createdAt;
                            let formattedDate = '-';
                            let formattedTime = '';
                            try {
                              if (dateValue) {
                                const d = new Date(dateValue);
                                if (!isNaN(d.getTime())) {
                                  formattedDate = d.toLocaleDateString('uk-UA');
                                  formattedTime = d.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
                                }
                              }
                            } catch {}
                            
                            const action = trade.action || trade.side || 'BUY';
                            const pnlPercent = trade.profit_percent ?? trade.pnl_percent ?? 0;
                            const pnlUsd = trade.profit_usd ?? trade.pnl_usd ?? 0;
                            const equity = trade.equity ?? trade.balance ?? 0;
                            const drawdown = trade.drawdown ?? 0;
                            
                            return (
                            <tr key={idx} className="border-t hover:bg-gray-50">
                              <td className="p-2 text-xs">
                                <div>{formattedDate}</div>
                                <div className="text-gray-400">{formattedTime}</div>
                              </td>
                              <td className="p-2 font-medium">{trade.symbol || trade.pair || '-'}</td>
                              <td className="p-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  action.toUpperCase() === 'BUY' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {action.toUpperCase()}
                                </span>
                              </td>
                              <td className="p-2">${(trade.price ?? 0).toFixed(2)}</td>
                              <td className={`p-2 font-medium ${
                                pnlPercent >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
                                <div className="text-xs text-gray-500">
                                  ${pnlUsd.toFixed(2)}
                                </div>
                              </td>
                              <td className="p-2">${equity.toFixed(0)}</td>
                              <td className="p-2 text-red-600">-{drawdown.toFixed(1)}%</td>
                              <td className="p-2">
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  trade.reason?.includes('Take Profit') ? 'bg-green-100 text-green-700' :
                                  trade.reason?.includes('Stop Loss') ? 'bg-red-100 text-red-700' :
                                  trade.reason?.includes('Entry') ? 'bg-blue-100 text-blue-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {trade.reason || trade.comment || '-'}
                                </span>
                              </td>
                              <td className="p-2 text-xs">
                                {trade.indicatorProof?.length > 0 ? (
                                  <div className="space-y-0.5">
                                    {trade.indicatorProof.map((proof, i) => (
                                      <div key={i} className={`px-1 py-0.5 rounded ${
                                        proof.triggered ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                      }`}>
                                        <span className="font-medium">{proof.indicator}:</span> {proof.value} {proof.condition} {proof.target}
                                        {proof.triggered && ' ✓'}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                            </tr>
                          )})}
                        </tbody>
                      </table>
                      {results.trades.length > 50 && (
                        <p className="text-center text-gray-500 text-sm mt-3">
                          Showing first 50 of {results.trades.length} trades. 
                          Download full report for all trades.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="text-6xl mb-4">📊</div>
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

