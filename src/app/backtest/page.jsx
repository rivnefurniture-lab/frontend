"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectInline } from "@/components/ui/select";
import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
import { Toggle, ToggleWithLabel } from "@/components/ui/toggle";
import { TooltipLabel } from "@/components/ui/tooltip";
import { apiFetch } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthProvider";
import { useSubscription } from "@/context/SubscriptionContext";
import Link from "next/link";
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
import {
  Settings2,
  GitGraph,
  ShieldCheck,
  PlayCircle,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  Clock,
  Wallet,
  Calendar,
  Layers,
  BarChart3,
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
  Target,
  HelpCircle
} from "lucide-react";
import { getTradingPairs, getDefaultPair, isCryptoMode, STOCKS_CONFIG } from "@/config/tradingMode";
import SuccessModal from "@/components/SuccessModal";
import VideoPlaceholder from "@/components/VideoPlaceholder";

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

// All timeframes available - different for crypto vs stocks
const CRYPTO_TIMEFRAMES = ["1m", "5m", "15m", "1h", "4h", "1d"];
const STOCKS_TIMEFRAMES = ["1h", "4h", "1d"]; // Stocks data is hourly-based from Yahoo Finance
const TIMEFRAMES = isCryptoMode() ? CRYPTO_TIMEFRAMES : STOCKS_TIMEFRAMES;
const RSI_LENGTHS = [7, 14, 21]; // Only these are pre-calculated in parquet
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

// Get pairs from config based on trading mode
const PAIRS = getTradingPairs();
const DEFAULT_PAIR = getDefaultPair();

// Get first 5 pairs as default selection
const DEFAULT_SELECTED_PAIRS = PAIRS.slice(0, 5);

// Quick period presets
const PERIOD_PRESETS = [
  { label: "1M", labelUk: "1М", months: 1 },
  { label: "3M", labelUk: "3М", months: 3 },
  { label: "6M", labelUk: "6М", months: 6 },
  { label: "1Y", labelUk: "1Р", months: 12 },
  { label: "3Y", labelUk: "3Р", months: 36 },
];

function ConditionBuilder({ condition, onChange, onRemove, language = "en" }) {
  const handleChange = (key, value) => {
    onChange({
      ...condition,
      subfields: { ...condition.subfields, [key]: value }
    });
  };

  // Custom styled select for condition builder
  const ConditionSelect = ({ value, onChange: onSelectChange, options, className = "" }) => (
    <Select
      value={value}
      onChange={onSelectChange}
      options={options}
      size="sm"
      className={className}
    />
  );
  
  // Mini tooltip label for condition builder (compact version)
  const TipLabel = ({ label, labelUk, tip, tipUk }) => (
    <TooltipLabel
      label={language === "uk" && labelUk ? labelUk : label}
      tooltip={tip}
      tooltipUk={tipUk}
      language={language}
      className="text-xs font-medium text-gray-500"
    />
  );

  return (
    <div className="bg-gray-50 p-4 border-2 border-gray-100" style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}>
      <div className="flex justify-between items-center mb-3">
        <Select
          value={condition.indicator}
          onChange={(val) => onChange({ ...condition, indicator: val, subfields: { Timeframe: TIMEFRAMES[0] } })}
          options={INDICATORS.map(ind => ({ value: ind.id, label: ind.name }))}
          size="sm"
          className="min-w-[200px]"
        />
        <button 
          onClick={onRemove} 
          className="ml-3 px-3 py-1.5 text-red-500 hover:text-white hover:bg-red-500 text-xs font-bold border-2 border-red-200 hover:border-red-500 transition-all"
          style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}
        >
          {language === "uk" ? "Видалити" : "Remove"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1.5">
            <TipLabel 
              label="Timeframe" 
              labelUk="Таймфрейм"
              tip="Chart interval for indicator calculation. Shorter = more signals but more noise. Longer = fewer but more reliable signals."
              tipUk="Інтервал графіка для розрахунку індикатора. Коротший = більше сигналів, але більше шуму. Довший = менше, але надійніші сигнали."
            />
          </label>
          <ConditionSelect
            value={condition.subfields?.Timeframe || TIMEFRAMES[0]}
            onChange={(val) => handleChange("Timeframe", val)}
            options={TIMEFRAMES.map(tf => ({ value: tf, label: tf }))}
          />
        </div>

        {/* RSI Indicator */}
        {condition.indicator === "RSI" && (
          <>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">
                <TipLabel 
                  label="RSI Length" 
                  labelUk="Період RSI"
                  tip="Number of periods for RSI calculation. 14 is standard. Lower = more sensitive, Higher = smoother."
                  tipUk="Кількість періодів для розрахунку RSI. 14 - стандарт. Менше = чутливіший, Більше = плавніший."
                />
              </label>
              <ConditionSelect
                value={condition.subfields?.["RSI Length"] || 14}
                onChange={(val) => handleChange("RSI Length", parseInt(val))}
                options={RSI_LENGTHS.map(len => ({ value: len, label: String(len) }))}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">
                <TipLabel 
                  label="Condition" 
                  labelUk="Умова"
                  tip="How to compare indicator value. 'Less Than' = buy when oversold (<30). 'Greater Than' = sell when overbought (>70)."
                  tipUk="Як порівнювати значення індикатора. 'Менше' = купити при перепроданості (<30). 'Більше' = продати при перекупленості (>70)."
                />
              </label>
              <ConditionSelect
                value={condition.subfields?.Condition || "Less Than"}
                onChange={(val) => handleChange("Condition", val)}
                options={CONDITIONS.map(c => ({ value: c, label: c }))}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">
                <TipLabel 
                  label="Signal Value" 
                  labelUk="Значення"
                  tip="RSI threshold (0-100). Common: 30 for oversold entry, 70 for overbought exit. Adjust based on asset volatility."
                  tipUk="Поріг RSI (0-100). Типово: 30 для перепроданості, 70 для перекупленості. Налаштуйте залежно від волатильності."
                />
              </label>
              <Input
                type="number"
                value={condition.subfields?.["Signal Value"] || 30}
                onChange={(e) => handleChange("Signal Value", parseFloat(e.target.value))}
                inputSize="sm"
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
              <label className="text-xs font-medium text-gray-500 block mb-1.5">
                <TipLabel 
                  label="MA Type" 
                  labelUk="Тип MA"
                  tip="SMA = Simple Moving Average (equal weight). EMA = Exponential (more weight to recent prices, faster reaction)."
                  tipUk="SMA = Проста ковзна середня (рівна вага). EMA = Експоненційна (більша вага останнім цінам, швидша реакція)."
                />
              </label>
              <ConditionSelect
                value={condition.subfields?.["MA Type"] || "SMA"}
                onChange={(val) => handleChange("MA Type", val)}
                options={[{ value: "SMA", label: "SMA" }, { value: "EMA", label: "EMA" }]}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">
                <TipLabel 
                  label="Fast MA" 
                  labelUk="Швидка MA"
                  tip="Short-term moving average period. Reacts faster to price changes. Common: 9, 14, 20."
                  tipUk="Період короткострокової ковзної середньої. Швидше реагує на зміни ціни. Типово: 9, 14, 20."
                />
              </label>
              <ConditionSelect
                value={condition.subfields?.["Fast MA"] || 14}
                onChange={(val) => handleChange("Fast MA", parseInt(val))}
                options={[5, 10, 14, 20, 25, 50].map(v => ({ value: v, label: String(v) }))}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">
                <TipLabel 
                  label="Slow MA" 
                  labelUk="Повільна MA"
                  tip="Long-term moving average period. Represents overall trend. Common: 50, 100, 200."
                  tipUk="Період довгострокової ковзної середньої. Представляє загальний тренд. Типово: 50, 100, 200."
                />
              </label>
              <ConditionSelect
                value={condition.subfields?.["Slow MA"] || 28}
                onChange={(val) => handleChange("Slow MA", parseInt(val))}
                options={[25, 50, 75, 100, 150, 200, 250].map(v => ({ value: v, label: String(v) }))}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">
                <TipLabel 
                  label="Condition" 
                  labelUk="Умова"
                  tip="'Crossing Up' = Fast MA crosses above Slow (bullish). 'Crossing Down' = Fast crosses below Slow (bearish)."
                  tipUk="'Перетин вгору' = Швидка MA перетинає повільну знизу (бичий). 'Перетин вниз' = перетинає зверху (ведмежий)."
                />
              </label>
              <ConditionSelect
                value={condition.subfields?.Condition || "Crossing Up"}
                onChange={(val) => handleChange("Condition", val)}
                options={CONDITIONS.map(c => ({ value: c, label: c }))}
              />
            </div>
          </>
        )}

        {/* MACD Indicator */}
        {condition.indicator === "MACD" && (
          <>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">
                <TipLabel 
                  label="MACD Preset" 
                  labelUk="Пресет MACD"
                  tip="Fast, Slow, Signal periods. Standard 12,26,9 is most common. Faster presets give more signals."
                  tipUk="Швидкий, повільний, сигнальний періоди. Стандарт 12,26,9 найпоширеніший. Швидші дають більше сигналів."
                />
              </label>
              <ConditionSelect
                value={condition.subfields?.["MACD Preset"] || "12,26,9"}
                onChange={(val) => handleChange("MACD Preset", val)}
                options={MACD_PRESETS}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">
                <TipLabel 
                  label="MACD Trigger" 
                  labelUk="Тригер MACD"
                  tip="'Crossing Up' = MACD line crosses above signal (buy). 'Crossing Down' = crosses below (sell)."
                  tipUk="'Перетин вгору' = лінія MACD перетинає сигнальну знизу (купівля). 'Перетин вниз' = зверху (продаж)."
                />
              </label>
              <ConditionSelect
                value={condition.subfields?.["MACD Trigger"] || "Crossing Up"}
                onChange={(val) => handleChange("MACD Trigger", val)}
                options={[{ value: "Crossing Up", label: "Crossing Up" }, { value: "Crossing Down", label: "Crossing Down" }]}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">
                <TipLabel 
                  label="Line Trigger" 
                  labelUk="Позиція лінії"
                  tip="Additional filter: 'Above Zero' = only in uptrend. 'Below Zero' = only in downtrend. 'Any' = no filter."
                  tipUk="Додатковий фільтр: 'Вище нуля' = тільки у висхідному тренді. 'Нижче нуля' = у низхідному. 'Будь-який' = без фільтра."
                />
              </label>
              <ConditionSelect
                value={condition.subfields?.["Line Trigger"] || ""}
                onChange={(val) => handleChange("Line Trigger", val)}
                options={[{ value: "", label: "Any" }, { value: "Greater Than 0", label: "Above Zero" }, { value: "Less Than 0", label: "Below Zero" }]}
              />
            </div>
          </>
        )}

        {/* Bollinger Bands Indicator */}
        {condition.indicator === "BollingerBands" && (
          <>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">
                <TipLabel 
                  label="BB Period" 
                  labelUk="Період BB"
                  tip="Number of periods for Bollinger Bands calculation. Standard is 20. Higher = wider bands."
                  tipUk="Кількість періодів для розрахунку Bollinger Bands. Стандарт 20. Більше = ширші смуги."
                />
              </label>
              <ConditionSelect
                value={condition.subfields?.["BB% Period"] || 20}
                onChange={(val) => handleChange("BB% Period", parseInt(val))}
                options={[10, 14, 20, 50, 100].map(v => ({ value: v, label: String(v) }))}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">
                <TipLabel 
                  label="Deviation" 
                  labelUk="Відхилення"
                  tip="Standard deviations for band width. Standard is 2. Higher = wider bands, fewer signals."
                  tipUk="Стандартні відхилення для ширини смуг. Стандарт 2. Більше = ширші смуги, менше сигналів."
                />
              </label>
              <ConditionSelect
                value={condition.subfields?.Deviation || 2}
                onChange={(val) => handleChange("Deviation", parseFloat(val))}
                options={[1, 1.5, 2, 2.5, 3].map(v => ({ value: v, label: String(v) }))}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">
                <TipLabel 
                  label="Condition" 
                  labelUk="Умова"
                  tip="How to compare %B value. 'Less Than 0' = below lower band (oversold). 'Greater Than 1' = above upper band."
                  tipUk="Як порівнювати значення %B. 'Менше 0' = нижче нижньої смуги (перепроданість). 'Більше 1' = вище верхньої смуги."
                />
              </label>
              <ConditionSelect
                value={condition.subfields?.Condition || "Less Than"}
                onChange={(val) => handleChange("Condition", val)}
                options={CONDITIONS.map(c => ({ value: c, label: c }))}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">
                <TipLabel 
                  label="%B Value (0-1)" 
                  labelUk="Значення %B"
                  tip="%B shows price position relative to bands. 0 = at lower band, 0.5 = at middle, 1 = at upper band."
                  tipUk="%B показує позицію ціни відносно смуг. 0 = на нижній смузі, 0.5 = посередині, 1 = на верхній смузі."
                />
              </label>
              <Input
                type="number"
                value={condition.subfields?.["Signal Value"] || 0}
                onChange={(e) => handleChange("Signal Value", parseFloat(e.target.value))}
                inputSize="sm"
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
              <label className="text-xs font-medium text-gray-500 block mb-1.5">
                <TipLabel 
                  label="Stochastic Preset" 
                  labelUk="Пресет Стохастику"
                  tip="%K period, %K smoothing, %D smoothing. Standard 14,3,3. Faster presets (9,3,3) give more signals."
                  tipUk="Період %K, згладжування %K, згладжування %D. Стандарт 14,3,3. Швидші (9,3,3) дають більше сигналів."
                />
              </label>
              <ConditionSelect
                value={condition.subfields?.["Stochastic Preset"] || "14,3,3"}
                onChange={(val) => handleChange("Stochastic Preset", val)}
                options={STOCHASTIC_PRESETS}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">
                <TipLabel 
                  label="K Condition" 
                  labelUk="Умова %K"
                  tip="How to compare %K value. 'Less Than 20' = oversold zone. 'Greater Than 80' = overbought zone."
                  tipUk="Як порівнювати значення %K. 'Менше 20' = зона перепроданості. 'Більше 80' = зона перекупленості."
                />
              </label>
              <ConditionSelect
                value={condition.subfields?.["K Condition"] || "Less Than"}
                onChange={(val) => handleChange("K Condition", val)}
                options={CONDITIONS.map(c => ({ value: c, label: c }))}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">
                <TipLabel 
                  label="K Signal Value" 
                  labelUk="Значення %K"
                  tip="Threshold for %K line (0-100). Common levels: 20 for oversold, 80 for overbought."
                  tipUk="Поріг для лінії %K (0-100). Типові рівні: 20 для перепроданості, 80 для перекупленості."
                />
              </label>
              <Input
                type="number"
                value={condition.subfields?.["K Signal Value"] || 20}
                onChange={(e) => handleChange("K Signal Value", parseFloat(e.target.value))}
                inputSize="sm"
                min={0}
                max={100}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">
                <TipLabel 
                  label="K/D Crossover" 
                  labelUk="Перетин K/D"
                  tip="Optional crossover signal. '%K Crossing Up %D' = bullish. '%K Crossing Down %D' = bearish."
                  tipUk="Необов'язковий сигнал перетину. '%K перетинає %D вгору' = бичий. '%K перетинає %D вниз' = ведмежий."
                />
              </label>
              <ConditionSelect
                value={condition.subfields?.Condition || ""}
                onChange={(val) => handleChange("Condition", val)}
                options={[{ value: "", label: "None" }, { value: "K Crossing Up D", label: "K Crossing Up D" }, { value: "K Crossing Down D", label: "K Crossing Down D" }]}
              />
            </div>
          </>
        )}

        {/* Parabolic SAR Indicator */}
        {condition.indicator === "ParabolicSAR" && (
          <>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">
                <TipLabel 
                  label="PSAR Preset" 
                  labelUk="Пресет PSAR"
                  tip="Step and Max values. Standard 0.02, 0.2. Conservative = fewer signals. Aggressive = more signals."
                  tipUk="Крок і максимальне значення. Стандарт 0.02, 0.2. Консервативний = менше сигналів. Агресивний = більше."
                />
              </label>
              <ConditionSelect
                value={condition.subfields?.["PSAR Preset"] || "0.02,0.2"}
                onChange={(val) => handleChange("PSAR Preset", val)}
                options={PSAR_PRESETS}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-gray-500 block mb-1.5">
                <TipLabel 
                  label="Condition" 
                  labelUk="Умова"
                  tip="'Crossing Long' = price moves above SAR dots (uptrend start). 'Crossing Short' = price moves below (downtrend)."
                  tipUk="'Перетин Long' = ціна рухається вище точок SAR (початок висхідного тренду). 'Перетин Short' = нижче (низхідний)."
                />
              </label>
              <ConditionSelect
                value={condition.subfields?.Condition || "Crossing (Long)"}
                onChange={(val) => handleChange("Condition", val)}
                options={[
                  { value: "Crossing (Long)", label: "Crossing (Long) - Price crosses above SAR" },
                  { value: "Crossing (Short)", label: "Crossing (Short) - Price crosses below SAR" }
                ]}
              />
            </div>
          </>
        )}

        {/* TradingView Signal */}
        {condition.indicator === "TradingView" && (
          <div className="md:col-span-3">
            <label className="text-xs font-medium text-gray-500 block mb-1.5">
              <TipLabel 
                label="Signal Value" 
                labelUk="Значення сигналу"
                tip="TradingView technical analysis recommendation. Aggregates 26 indicators. 'Strong Buy' = most bullish, 'Strong Sell' = most bearish."
                tipUk="Рекомендація технічного аналізу TradingView. Агрегує 26 індикаторів. 'Strong Buy' = найбільш бичий, 'Strong Sell' = найбільш ведмежий."
              />
            </label>
            <ConditionSelect
              value={condition.subfields?.["Signal Value"] || "Buy"}
              onChange={(val) => handleChange("Signal Value", val)}
              options={TRADINGVIEW_SIGNALS.map(s => ({ value: s, label: s }))}
            />
          </div>
        )}

        {/* Heiken Ashi */}
        {condition.indicator === "HeikenAshi" && (
          <>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">
                <TipLabel 
                  label="Condition" 
                  labelUk="Умова"
                  tip="Heiken Ashi smooths candles for trend clarity. 'Greater Than 0' = bullish candles. 'Less Than 0' = bearish."
                  tipUk="Heiken Ashi згладжує свічки для ясності тренду. 'Більше 0' = бичі свічки. 'Менше 0' = ведмежі."
                />
              </label>
              <ConditionSelect
                value={condition.subfields?.Condition || "Greater Than"}
                onChange={(val) => handleChange("Condition", val)}
                options={[{ value: "Greater Than", label: "Greater Than" }, { value: "Less Than", label: "Less Than" }]}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">
                <TipLabel 
                  label="Signal Value" 
                  labelUk="Значення"
                  tip="Threshold value for comparison. Usually 0 for trend direction (positive = bullish, negative = bearish)."
                  tipUk="Порогове значення для порівняння. Зазвичай 0 для напрямку тренду (позитивне = бичий, негативне = ведмежий)."
                />
              </label>
              <Input
                type="number"
                value={condition.subfields?.["Signal Value"] || 0}
                onChange={(e) => handleChange("Signal Value", parseFloat(e.target.value))}
                inputSize="sm"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Subscription Status Bar Component
function SubscriptionStatusBar() {
  const { language } = useLanguage();
  const { subscription, plan, backtestsRemaining, isPro, loading } = useSubscription();

  if (loading || !subscription) return null;

  // Don't show for Pro/Enterprise users with unlimited backtests
  if (isPro) return null;

  const remaining = typeof backtestsRemaining === 'number' ? backtestsRemaining : 0;
  const isLimitReached = remaining <= 0;

  return (
    <div className={`mb-6 border-2 p-4 ${isLimitReached ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`} style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${isLimitReached ? 'bg-red-500' : 'bg-gray-800'} flex items-center justify-center`} style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p className={`font-bold ${isLimitReached ? 'text-red-800' : 'text-gray-800'}`}>
              {language === "uk" ? "Безкоштовний план" : "Free Plan"}
              <span className="ml-2 text-sm font-normal">
                {isLimitReached
                  ? (language === "uk" ? "• Ліміт вичерпано" : "• Limit reached")
                  : `• ${remaining} ${language === "uk" ? "бектестів залишилось сьогодні" : "backtests remaining today"}`
                }
              </span>
            </p>
            <p className={`text-sm ${isLimitReached ? 'text-red-600' : 'text-gray-600'}`}>
              {isLimitReached
                ? (language === "uk"
                  ? "Оновіть до Pro для необмежених бектестів та 5 років історичних даних"
                  : "Upgrade to Pro for unlimited backtests and 5 years of historical data")
                : (language === "uk"
                  ? "Оновіть план для необмежених бектестів"
                  : "Upgrade your plan for unlimited backtests")
              }
            </p>
          </div>
        </div>
        <Link href="/pricing">
          <button className="px-4 py-2 bg-black text-white text-sm font-bold hover:bg-gray-800 transition-all" style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
            {language === "uk" ? "Оновити план" : "Upgrade Plan"}
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function BacktestPage() {
  const { t, language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [strategyName, setStrategyName] = useState("My Strategy");
  const [selectedPairs, setSelectedPairs] = useState(DEFAULT_SELECTED_PAIRS);
  const [useAllPairs, setUseAllPairs] = useState(true); // Default: use all pairs
  const [maxActiveDeals, setMaxActiveDeals] = useState(1);
  
  // Form validation errors
  const [formErrors, setFormErrors] = useState({});
  const [initialBalance, setInitialBalance] = useState(10000);

  // Base order size is auto-calculated: initialBalance / maxActiveDeals
  const baseOrderSize = Math.floor(initialBalance / maxActiveDeals);
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
  const [stopLossType, setStopLossType] = useState("percentage-base"); // percentage-base or percentage-total

  // === EXIT CONDITIONS (matching backtest2.py) ===
  const [conditionsActive, setConditionsActive] = useState(true); // conditions_active - default ON

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
  const [reinvestToggle, setReinvestToggle] = useState(true); // reinvest profits toggle - default ON
  const [minDailyVolume, setMinDailyVolume] = useState(0); // min_daily_volume
  const [cooldownBetweenDeals, setCooldownBetweenDeals] = useState(0); // cooldown_between_deals (minutes)
  const [closeDealAfterTimeout, setCloseDealAfterTimeout] = useState(0); // close_deal_after_timeout (minutes)

  // Market state mode
  const [useMarketState, setUseMarketState] = useState(false);

  // Conditions - use first available timeframe as default
  const defaultTimeframe = TIMEFRAMES[0];
  const [entryConditions, setEntryConditions] = useState([
    { indicator: "RSI", subfields: { Timeframe: defaultTimeframe, Condition: "Less Than", "Signal Value": 30, "RSI Length": 14 } }
  ]);
  const [exitConditions, setExitConditions] = useState([
    { indicator: "RSI", subfields: { Timeframe: defaultTimeframe, Condition: "Greater Than", "Signal Value": 70, "RSI Length": 14 } }
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

  // Success modal state
  const [successModal, setSuccessModal] = useState({ open: false, position: 1, wait: 10 });

  // Notification preferences
  const [notifyVia, setNotifyVia] = useState('email'); // 'email', 'telegram', 'both'
  const [userProfile, setUserProfile] = useState(null);
  
  // Load user profile for notification settings
  useEffect(() => {
    if (user) {
      apiFetch("/user/profile").then(profile => {
        if (profile && !profile.error) {
          setUserProfile(profile);
          // Default to 'both' if telegram is set up, otherwise 'email'
          if (profile.telegramId && profile.telegramEnabled) {
            setNotifyVia('both');
          }
        }
      }).catch(() => {});
    }
  }, [user]);

  // Selected period for quick buttons
  const [selectedPeriod, setSelectedPeriod] = useState(6); // default 6 months

  // Tab navigation for configuration sections
  const [activeConfigTab, setActiveConfigTab] = useState("settings"); // settings, conditions, advanced

  // Helper to set date range from period preset
  const setDatePeriod = (months) => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - months);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    setSelectedPeriod(months);
  };

  const addCondition = (type) => {
    const newCondition = {
      indicator: "RSI",
      subfields: { Timeframe: TIMEFRAMES[0], Condition: "Less Than", "Signal Value": 30, "RSI Length": 14 }
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

  // Validate form and return errors object
  const validateForm = () => {
    const errors = {};
    
    // Strategy name required
    if (!strategyName || strategyName.trim() === "") {
      errors.strategyName = language === "uk" 
        ? "Введіть назву стратегії" 
        : "Enter strategy name";
    }
    
    // Max active deals required and valid
    if (!maxActiveDeals || maxActiveDeals < 1) {
      errors.maxActiveDeals = language === "uk"
        ? "Мінімум 1 активна угода"
        : "Minimum 1 active deal";
    }
    
    // Initial balance required
    if (!initialBalance || initialBalance < 100) {
      errors.initialBalance = language === "uk"
        ? "Мінімальний баланс $100"
        : "Minimum balance $100";
    }
    
    // Pairs required (only if useAllPairs is off)
    const effectivePairs = useAllPairs ? PAIRS : selectedPairs;
    if (!effectivePairs || effectivePairs.length === 0) {
      errors.pairs = language === "uk"
        ? "Оберіть хоча б один актив"
        : "Select at least one asset";
    }
    
    // Date range validation
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    
    if (!startDate) {
      errors.startDate = language === "uk" ? "Оберіть дату початку" : "Select start date";
    } else if (start >= end) {
      errors.startDate = language === "uk" 
        ? "Дата початку повинна бути раніше дати закінчення" 
        : "Start date must be before end date";
    }
    
    if (!endDate) {
      errors.endDate = language === "uk" ? "Оберіть дату закінчення" : "Select end date";
    } else if (end > now) {
      errors.endDate = language === "uk"
        ? "Дата не може бути в майбутньому"
        : "Date cannot be in the future";
    }
    
    // Entry conditions required
    const hasEntryConditions = entryConditions.length > 0 ||
      (useMarketState && (bullishEntryConditions.length > 0 || bearishEntryConditions.length > 0));
    if (!hasEntryConditions) {
      errors.entryConditions = language === "uk"
        ? "Додайте хоча б одну умову входу"
        : "Add at least one entry condition";
    }
    
    return errors;
  };
  
  // Scroll to first error field
  const scrollToFirstError = (errors) => {
    const fieldOrder = ['strategyName', 'maxActiveDeals', 'initialBalance', 'startDate', 'endDate', 'pairs', 'entryConditions'];
    for (const field of fieldOrder) {
      if (errors[field]) {
        const element = document.getElementById(`field-${field}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Switch to correct tab if needed
          if (['strategyName', 'maxActiveDeals', 'initialBalance', 'startDate', 'endDate', 'pairs'].includes(field)) {
            setActiveConfigTab('settings');
          } else if (field === 'entryConditions') {
            setActiveConfigTab('conditions');
          }
        }
        break;
      }
    }
  };

  const runBacktest = async () => {
    // Clear previous errors
    setFormErrors({});
    setError(null);
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      scrollToFirstError(errors);
      return;
    }
    
    setLoading(true);
    setSaved(false);

    // Additional validation for data availability
    const validationErrors = [];
    const start = new Date(startDate);
    const isCrypto = isCryptoMode();
    const minDataDate = isCrypto
      ? new Date('2020-01-01')
      : new Date('2022-01-01');

    if (start < minDataDate) {
      validationErrors.push(language === "uk"
        ? `Дані доступні тільки з ${minDataDate.toLocaleDateString()}. Оберіть пізнішу дату початку.`
        : `Data is only available from ${minDataDate.toLocaleDateString()}. Please select a later start date.`);
    }

    if (validationErrors.length > 0) {
      setError(validationErrors.join('\n'));
      setLoading(false);
      return;
    }

    try {
      // Build payload matching backtest2.py EXACTLY
      const effectivePairs = useAllPairs ? PAIRS : selectedPairs;
      const payload = {
        strategy_name: strategyName,
        pairs: effectivePairs,
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
        stop_loss_type: stopLossType,
        stop_loss_timeout: 0, // Removed from UI, always 0

        // Safety Orders / DCA (backtest2.py names)
        safety_order_toggle: safetyOrderToggle,
        safety_order_size: safetyOrderSize,
        price_deviation: priceDeviation,
        max_safety_orders_count: maxSafetyOrdersCount,
        safety_order_volume_scale: safetyOrderVolumeScale,
        safety_order_step_scale: safetyOrderStepScale,

        // Other settings (backtest2.py names)
        reinvest_profit: reinvestToggle ? 100 : 0, // Either reinvest 100% or 0%
        risk_reduction: 0, // Removed from UI
        min_daily_volume: minDailyVolume,
        cooldown_between_deals: cooldownBetweenDeals,
        close_deal_after_timeout: closeDealAfterTimeout,
      };

      // Add to queue for proper backtest execution with backtest2.py on Contabo
      const queueResponse = await apiFetch("/backtest/queue", {
        method: "POST",
        body: {
          payload,
          notifyVia: notifyVia,
        },
      });

      // Check for subscription limit error
      if (queueResponse.error) {
        if (queueResponse.limitReached) {
          setError(
            language === "uk"
              ? `${queueResponse.error} Оновіть план для необмежених бектестів.`
              : `${queueResponse.error}`
          );
          setResults({
            status: 'limit_reached',
            message: queueResponse.error,
            upgrade: queueResponse.upgrade,
          });
        } else {
          setError(queueResponse.error);
        }
        return;
      }

      // Show success message and queue info
      setResults({
        status: 'queued',
        message: `Backtest added to queue! Position: #${queueResponse.queuePosition || 1}`,
        queueId: queueResponse.queueId,
        estimatedWait: queueResponse.estimatedWaitMinutes,
      });

      // Show success modal
      setSuccessModal({
        open: true,
        position: queueResponse.queuePosition || 1,
        wait: queueResponse.estimatedWaitMinutes || 10,
      });

    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString();
  };

  // Auth guard - require login
  if (authLoading) {
    return (
      <div className="container py-16 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent mx-auto" style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}></div>
        <p className="mt-4 text-gray-600">{language === "uk" ? "Завантаження..." : "Loading..."}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto bg-white border-2 border-gray-100 p-8 text-center" style={{ clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))' }}>
          <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-4" style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">
            {language === "uk" ? "Потрібна авторизація" : "Login Required"}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === "uk"
              ? "Увійдіть, щоб створювати та тестувати моделі"
              : "Please log in to create and test models"}
          </p>
          <Link href="/auth">
            <button className="w-full px-4 py-3 bg-black text-white font-bold hover:bg-gray-800 transition-all" style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}>
              {language === "uk" ? "Увійти / Зареєструватися" : "Login / Sign Up"}
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Success Modal */}
      <SuccessModal
        open={successModal.open}
        onClose={() => setSuccessModal({ ...successModal, open: false })}
        title={language === "uk" ? "Бектест в черзі!" : "Backtest Queued!"}
        subtitle={language === "uk"
          ? "Ваш бектест додано до черги обробки"
          : "Your backtest has been added to the processing queue"
        }
        icon="queue"
        details={[
          {
            label: language === "uk" ? "Позиція в черзі" : "Queue Position",
            value: `#${successModal.position}`
          },
          {
            label: language === "uk" ? "Очікуваний час" : "Estimated Wait",
            value: `~${successModal.wait} ${language === "uk" ? "хв" : "min"}`
          },
        ]}
        footer={language === "uk"
          ? `Ви отримаєте сповіщення ${notifyVia === 'telegram' ? 'в Telegram' : notifyVia === 'both' ? 'на email і в Telegram' : 'на email'} коли бектест завершиться. Слідкуйте за прогресом у плаваючому моніторі!`
          : `You'll receive a ${notifyVia === 'telegram' ? 'Telegram message' : notifyVia === 'both' ? 'notification via email and Telegram' : 'notification via email'} when complete. Watch the floating monitor for live progress!`
        }
      />

      {/* Professional Header */}
      <div className="mb-10">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            {language === "uk" ? "Візуальний конструктор стратегій" : "Visual Strategy Builder"}
          </div>
          <h1 className="text-4xl font-bold mb-3">{t("backtest.title")}</h1>
          <p className="text-gray-600 text-lg">{t("backtest.subtitle")}</p>
        </div>
      </div>

      {/* Subscription Status Bar */}
      <SubscriptionStatusBar />

      {/* Stocks Mode Notice */}
      {!isCryptoMode() && (
        <div className="mb-6 bg-emerald-50 border-2 border-emerald-200 p-4" style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-emerald-500 flex items-center justify-center flex-shrink-0" style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-emerald-800 font-bold">
                {language === "uk" ? "Режим аналізу акцій" : "Stock Analysis Mode"}
              </p>
              <p className="text-emerald-700 text-sm mt-1">
                {language === "uk"
                  ? "Бектестинг використовує реальні історичні дані Yahoo Finance. Жива торгівля акціями буде доступна незабаром."
                  : "Backtesting uses real Yahoo Finance historical data. Live stock trading will be available soon."}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className={`grid gap-8 ${results ? "lg:grid-cols-3" : "lg:grid-cols-1 max-w-4xl mx-auto"}`}>
        {/* Configuration Panel */}
        <div className={`${results ? "lg:col-span-2" : ""} space-y-6`}>
          {/* Modern Stepper Navigation */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-8">
            <div className="flex items-center justify-between">
              {[
                {
                  id: "settings",
                  step: 1,
                  label: language === "uk" ? "Налаштування" : "Configuration",
                  desc: language === "uk" ? "Активи та час" : "Assets & Time",
                  icon: <Settings2 className="w-5 h-5" />
                },
                {
                  id: "conditions",
                  step: 2,
                  label: language === "uk" ? "Логіка" : "Strategy Logic",
                  desc: language === "uk" ? "Вхід та вихід" : "Entry & Exit",
                  icon: <GitGraph className="w-5 h-5" />
                },
                {
                  id: "advanced",
                  step: 3,
                  label: language === "uk" ? "Ризики" : "Risk Management",
                  desc: language === "uk" ? "Захист капіталу" : "Capital Protection",
                  icon: <ShieldCheck className="w-5 h-5" />
                },
              ].map((step, idx, arr) => {
                const isActive = activeConfigTab === step.id;
                const isCompleted =
                  (step.id === "settings" && activeConfigTab !== "settings") ||
                  (step.id === "conditions" && activeConfigTab === "advanced");

                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <button
                      onClick={() => setActiveConfigTab(step.id)}
                      className={`flex items-center gap-4 flex-1 p-3 rounded-xl transition-all ${
                        isActive 
                          ? "bg-black text-white" 
                          : isCompleted 
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" 
                            : "hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isActive
                            ? "bg-white/20"
                            : isCompleted
                              ? "bg-emerald-500 text-white"
                              : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {isCompleted && !isActive ? <CheckCircle2 className="w-6 h-6" /> : step.icon}
                      </div>
                      <div className="text-left hidden sm:block">
                        <span className={`text-xs font-medium uppercase tracking-wider block ${
                          isActive ? "text-white/70" : "text-gray-400"
                        }`}>
                          {language === "uk" ? "Крок" : "Step"} {step.step}
                        </span>
                        <span className={`text-sm font-bold ${isActive ? "text-white" : ""}`}>
                          {step.label}
                        </span>
                      </div>
                    </button>
                    {idx < arr.length - 1 && (
                      <div className={`w-8 h-0.5 mx-2 flex-shrink-0 ${
                        isCompleted ? "bg-emerald-500" : "bg-gray-200"
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Settings Tab */}
          {activeConfigTab === "settings" && (
            <>
              {/* Basic Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("backtest.strategySettings")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Strategy Name */}
                    <div id="field-strategyName">
                      <label className="text-sm font-medium block mb-1.5 flex items-center gap-1">
                        {t("backtest.strategyName")}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={strategyName}
                        onChange={(e) => { setStrategyName(e.target.value); setFormErrors(prev => ({...prev, strategyName: null})); }}
                        placeholder={language === "uk" ? "Моя стратегія" : "My Strategy"}
                        error={!!formErrors.strategyName}
                      />
                      {formErrors.strategyName && (
                        <p className="text-xs text-red-500 mt-1 font-medium">{formErrors.strategyName}</p>
                      )}
                    </div>
                    
                    {/* Max Active Deals */}
                    <div id="field-maxActiveDeals">
                      <label className="text-sm font-medium block mb-1.5 flex items-center gap-1">
                        <TooltipLabel
                          label={t("backtest.maxActiveDeals")}
                          tooltip="Maximum positions held at once. More deals = more diversification but capital is split across them."
                          tooltipUk="Максимальна кількість позицій одночасно. Більше угод = більша диверсифікація, але капітал розділяється між ними."
                          language={language}
                        />
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="number"
                        value={maxActiveDeals}
                        onChange={(e) => { setMaxActiveDeals(parseInt(e.target.value) || 1); setFormErrors(prev => ({...prev, maxActiveDeals: null})); }}
                        min={1}
                        max={20}
                        error={!!formErrors.maxActiveDeals}
                      />
                      {formErrors.maxActiveDeals && (
                        <p className="text-xs text-red-500 mt-1 font-medium">{formErrors.maxActiveDeals}</p>
                      )}
                    </div>
                    
                    {/* Initial Balance */}
                    <div id="field-initialBalance">
                      <label className="text-sm font-medium block mb-1.5 flex items-center gap-1">
                        <TooltipLabel
                          label={t("backtest.initialBalance")}
                          tooltip="Starting capital for the backtest. Results scale proportionally to this amount."
                          tooltipUk="Початковий капітал для бектесту. Результати масштабуються пропорційно цій сумі."
                          language={language}
                        />
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="number"
                        value={initialBalance}
                        onChange={(e) => { setInitialBalance(parseFloat(e.target.value) || 0); setFormErrors(prev => ({...prev, initialBalance: null})); }}
                        error={!!formErrors.initialBalance}
                      />
                      {formErrors.initialBalance && (
                        <p className="text-xs text-red-500 mt-1 font-medium">{formErrors.initialBalance}</p>
                      )}
                    </div>
                    
                    {/* Base Order Size (auto-calculated) */}
                    <div>
                      <label className="text-sm font-medium block mb-1.5">
                        <TooltipLabel
                          label={t("backtest.baseOrderSize")}
                          tooltip="Auto-calculated as Initial Balance ÷ Max Active Deals. This ensures you have enough capital for all positions."
                          tooltipUk="Автоматично розраховується як Початковий баланс ÷ Макс. активних угод. Це гарантує достатній капітал для всіх позицій."
                          language={language}
                        />
                      </label>
                      <Input
                        type="number"
                        value={baseOrderSize}
                        readOnly
                        className="bg-gray-50 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">= ${initialBalance.toLocaleString()} ÷ {maxActiveDeals}</p>
                    </div>
                    
                    {/* Trading Fee */}
                    <div>
                      <label className="text-sm font-medium block mb-1.5">
                        <TooltipLabel
                          label={language === "uk" ? "Комісія (%)" : "Trading Fee (%)"}
                          tooltip="Exchange fee per trade. Binance: 0.1%, Bybit: 0.075%. Applied to every buy and sell."
                          tooltipUk="Комісія біржі за угоду. Binance: 0.1%, Bybit: 0.075%. Застосовується до кожної покупки і продажу."
                          language={language}
                        />
                      </label>
                      <Input
                        type="number"
                        value={tradingFee}
                        onChange={(e) => setTradingFee(parseFloat(e.target.value) || 0)}
                        step={0.01}
                        min={0}
                        max={1}
                      />
                    </div>
                    
                    {/* Date Range with Quick Periods */}
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium block mb-2">
                        <TooltipLabel
                          label={language === "uk" ? "Період тестування" : "Testing Period"}
                          tooltip="Select backtest period. More history = more reliable results but longer processing time."
                          tooltipUk="Оберіть період бектесту. Більше історії = надійніші результати, але довша обробка."
                          language={language}
                        />
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {PERIOD_PRESETS.map((preset) => (
                          <button
                            key={preset.months}
                            onClick={() => { setDatePeriod(preset.months); setFormErrors(prev => ({...prev, startDate: null, endDate: null})); }}
                            className={`px-4 py-2 text-sm font-bold transition ${selectedPeriod === preset.months
                              ? "bg-black text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
                          >
                            {language === "uk" ? preset.labelUk : preset.label}
                          </button>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div id="field-startDate">
                          <label className="text-xs font-medium text-gray-600 block mb-1.5 flex gap-1">
                            {t("backtest.startDate")} <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => { setStartDate(e.target.value); setSelectedPeriod(null); setFormErrors(prev => ({...prev, startDate: null})); }}
                            error={!!formErrors.startDate}
                          />
                          {formErrors.startDate && (
                            <p className="text-xs text-red-500 mt-1 font-medium">{formErrors.startDate}</p>
                          )}
                        </div>
                        <div id="field-endDate">
                          <label className="text-xs font-medium text-gray-600 block mb-1.5 flex gap-1">
                            {t("backtest.endDate")} <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => { setEndDate(e.target.value); setSelectedPeriod(null); setFormErrors(prev => ({...prev, endDate: null})); }}
                            error={!!formErrors.endDate}
                          />
                          {formErrors.endDate && (
                            <p className="text-xs text-red-500 mt-1 font-medium">{formErrors.endDate}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trading Pairs with "Use All" toggle */}
                  <div className="mt-6 pt-4 border-t border-gray-200" id="field-pairs">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium flex items-center gap-1">
                        <TooltipLabel
                          label={t("backtest.tradingPairs")}
                          tooltip="Assets to test your strategy on. 'Use all' includes all available pairs. Uncheck to manually select specific pairs."
                          tooltipUk="Активи для тестування вашої стратегії. 'Використати всі' включає всі доступні пари. Зніміть прапорець для ручного вибору."
                          language={language}
                        />
                        <span className="text-red-500">*</span>
                      </label>
                      <ToggleWithLabel
                        checked={useAllPairs}
                        onChange={(val) => { setUseAllPairs(val); setFormErrors(prev => ({...prev, pairs: null})); }}
                        label={language === "uk" ? "Використати всі" : "Use all pairs"}
                        labelPosition="left"
                        size="sm"
                      />
                    </div>
                    
                    {/* Show count when using all */}
                    {useAllPairs && (
                      <div className="bg-emerald-50 border-2 border-emerald-100 p-3 text-sm text-emerald-700 font-medium" style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}>
                        {language === "uk" 
                          ? `✓ Буде використано всі ${PAIRS.length} доступних ${isCryptoMode() ? "криптопар" : "акцій"}`
                          : `✓ Will use all ${PAIRS.length} available ${isCryptoMode() ? "crypto pairs" : "stocks"}`}
                      </div>
                    )}
                    
                    {/* Show pair selection only when useAllPairs is off */}
                    {!useAllPairs && (
                      <>
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
                                setFormErrors(prev => ({...prev, pairs: null}));
                              }}
                              className={`px-3 py-1.5 text-sm font-medium transition ${selectedPairs.includes(pair)
                                ? "bg-black text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
                            >
                              {pair}
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {language === "uk" 
                            ? `Обрано: ${selectedPairs.length} з ${PAIRS.length}` 
                            : `Selected: ${selectedPairs.length} of ${PAIRS.length}`}
                        </p>
                      </>
                    )}
                    
                    {formErrors.pairs && (
                      <p className="text-xs text-red-500 mt-2 font-medium">{formErrors.pairs}</p>
                    )}
                  </div>

                  {/* Take Profit & Stop Loss - Professional Design */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Take Profit */}
                      <div className="bg-gradient-to-br from-emerald-50 to-white p-4 border-2 border-emerald-100" style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}>
                        <div className="flex items-center gap-3 mb-3">
                          <Checkbox
                            checked={priceChangeActive}
                            onChange={setPriceChangeActive}
                            size="md"
                          />
                          <label className="font-bold text-sm text-emerald-800">
                            <TooltipLabel
                              label="Take Profit"
                              tooltip="Automatically sell when profit reaches target %. Locks in gains. Without it, relies only on exit conditions."
                              tooltipUk="Автоматично продати, коли прибуток досягне цільового %. Фіксує прибуток. Без цього, покладається лише на умови виходу."
                              language={language}
                            />
                          </label>
                        </div>
                        {priceChangeActive && (
                          <div className="space-y-3 pl-8">
                            <div className="flex items-center gap-2 flex-wrap">
                              <TooltipLabel
                                label=""
                                tooltip="'% of total' = profit from entire position including safety orders. '% of base' = profit from initial order only."
                                tooltipUk="'% від загальної' = прибуток від всієї позиції включаючи safety orders. '% від базового' = прибуток лише від початкового ордера."
                                language={language}
                                className="mr-1"
                              />
                              <SelectInline
                                value={takeProfitType}
                                onChange={setTakeProfitType}
                                options={[
                                  { value: "percentage-total", label: `% ${language === "uk" ? "від загальної" : "of total"}` },
                                  { value: "percentage-base", label: `% ${language === "uk" ? "від базового" : "of base"}` }
                                ]}
                              />
                              <Input
                                type="number"
                                value={targetProfit}
                                onChange={(e) => setTargetProfit(parseFloat(e.target.value))}
                                min={0.1}
                                step={0.1}
                                className="w-20 h-8 text-sm"
                              />
                              <span className="text-sm font-medium text-gray-500">%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={trailingToggle}
                                onChange={setTrailingToggle}
                                size="sm"
                              />
                              <TooltipLabel
                                label="Trailing"
                                tooltip="Instead of fixed target, trails the price up and sells when price drops by deviation %. Captures more profit in strong trends."
                                tooltipUk="Замість фіксованої цілі, слідує за ціною вгору і продає коли ціна падає на % відхилення. Захоплює більше прибутку в сильних трендах."
                                language={language}
                                className="text-xs font-medium text-gray-600"
                              />
                              {trailingToggle && (
                                <>
                                  <Input
                                    type="number"
                                    value={trailingDeviation}
                                    onChange={(e) => setTrailingDeviation(parseFloat(e.target.value))}
                                    min={0.1}
                                    step={0.1}
                                    className="w-16 h-7 text-xs"
                                  />
                                  <span className="text-xs text-gray-500">%</span>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Stop Loss */}
                      <div className="bg-gradient-to-br from-red-50 to-white p-4 border-2 border-red-100" style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}>
                        <div className="flex items-center gap-3 mb-3">
                          <Checkbox
                            checked={stopLossToggle}
                            onChange={setStopLossToggle}
                            size="md"
                          />
                          <label className="font-bold text-sm text-red-800">
                            <TooltipLabel
                              label="Stop Loss"
                              tooltip="Automatically sell when loss reaches limit %. Protects capital from large losses. Essential for risk management."
                              tooltipUk="Автоматично продати, коли збиток досягає ліміту %. Захищає капітал від великих втрат. Необхідний для управління ризиками."
                              language={language}
                            />
                          </label>
                        </div>
                        {stopLossToggle && (
                          <div className="space-y-3 pl-8">
                            <div className="flex items-center gap-2 flex-wrap">
                              <TooltipLabel
                                label=""
                                tooltip="'% of base' = loss calculated from initial entry price. '% of total' = loss from average price including safety orders."
                                tooltipUk="'% від базового' = збиток розраховується від початкової ціни входу. '% від загальної' = збиток від середньої ціни включаючи safety orders."
                                language={language}
                                className="mr-1"
                              />
                              <SelectInline
                                value={stopLossType}
                                onChange={setStopLossType}
                                options={[
                                  { value: "percentage-base", label: `% ${language === "uk" ? "від базового" : "of base"}` },
                                  { value: "percentage-total", label: `% ${language === "uk" ? "від загальної" : "of total"}` }
                                ]}
                              />
                              <Input
                                type="number"
                                value={stopLossValue}
                                onChange={(e) => setStopLossValue(parseFloat(e.target.value))}
                                min={0.1}
                                step={0.1}
                                className="w-20 h-8 text-sm"
                              />
                              <span className="text-sm font-medium text-gray-500">%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Reinvest Toggle */}
                    <div className="mt-4 p-4 bg-gray-50 border-2 border-gray-100" style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}>
                      <ToggleWithLabel
                        checked={reinvestToggle}
                        onChange={setReinvestToggle}
                        label={language === "uk" ? "Реінвестувати прибуток" : "Reinvest Profits"}
                        description={language === "uk"
                          ? "Автоматично додавати прибуток до наступних угод, збільшуючи розмір позицій"
                          : "Automatically add profits to next trades, increasing position sizes over time"}
                        labelPosition="right"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>


              {/* Next Step Button */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setActiveConfigTab("conditions")}
                  className="px-8 py-3 bg-black text-white font-bold flex items-center gap-2 group hover:bg-gray-800 transition-all"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
                >
                  {language === "uk" ? "Крок 2: Логіка стратегії" : "Step 2: Strategy Logic"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </>)}

          {/* Conditions Tab */}
          {activeConfigTab === "conditions" && (
            <>
              {/* Video Tutorial for Conditions */}
              <VideoPlaceholder
                title="Understanding Entry & Exit Conditions"
                titleUk="Розуміння умов входу та виходу"
                description="Learn how to combine indicators for powerful strategies"
                descriptionUk="Навчіться комбінувати індикатори для потужних стратегій"
                duration="4:30"
                topic="advanced"
                language={language}
                variant="inline"
                className="mb-6"
              />

              {/* Entry Conditions */}
              <Card id="field-entryConditions" className={formErrors.entryConditions ? "border-red-300" : ""}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-green-600 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                      <TooltipLabel
                        label={t("backtest.entryConditions")}
                        tooltip="Conditions that trigger buying. All conditions must be met (AND logic). At least one entry condition is required."
                        tooltipUk="Умови для входу в позицію. Всі умови повинні виконатися одночасно (логіка І). Потрібна хоча б одна умова входу."
                        language={language}
                      />
                      <span className="text-red-500">*</span>
                    </CardTitle>
                    {formErrors.entryConditions && (
                      <p className="text-xs text-red-500 mt-1 font-medium">{formErrors.entryConditions}</p>
                    )}
                  </div>
                  <Button size="sm" variant="outline" onClick={() => { addCondition("entry"); setFormErrors(prev => ({...prev, entryConditions: null})); }}>
                    {t("backtest.addCondition")}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {entryConditions.map((cond, i) => (
                    <ConditionBuilder
                      key={i}
                      condition={cond}
                      language={language}
                      onChange={(updated) => {
                        const newConds = [...entryConditions];
                        newConds[i] = updated;
                        setEntryConditions(newConds);
                      }}
                      onRemove={() => setEntryConditions(entryConditions.filter((_, j) => j !== i))}
                    />
                  ))}
                  {entryConditions.length === 0 && (
                    <div className={`text-center py-4 ${formErrors.entryConditions ? "bg-red-50 border-2 border-red-200 rounded-lg" : ""}`}>
                      <p className={`text-sm ${formErrors.entryConditions ? "text-red-600 font-medium" : "text-gray-500"}`}>
                        {formErrors.entryConditions 
                          ? formErrors.entryConditions
                          : t("backtest.noEntryConditions")}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Exit Conditions - with toggle */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={conditionsActive}
                      onChange={setConditionsActive}
                      size="md"
                    />
                    <CardTitle className="text-red-600 flex items-center gap-2">
                      <TooltipLabel
                        label={t("backtest.exitConditions")}
                        tooltip="Conditions to exit a position (sell). Optional - can rely on Take Profit/Stop Loss instead. All conditions must be met (AND logic)."
                        tooltipUk="Умови для виходу з позиції (продажу). Необов'язкові - можна покладатися на Take Profit/Stop Loss. Всі умови повинні виконатися (логіка І)."
                        language={language}
                      />
                    </CardTitle>
                  </div>
                  {conditionsActive && (
                    <Button size="sm" variant="outline" onClick={() => addCondition("exit")}>
                      {t("backtest.addCondition")}
                    </Button>
                  )}
                </CardHeader>
                {conditionsActive && (
                  <CardContent className="space-y-3">
                    {exitConditions.map((cond, i) => (
                      <ConditionBuilder
                        key={i}
                        condition={cond}
                        language={language}
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
                )}
              </Card>

              {/* Safety Orders (DCA) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <TooltipLabel
                      label={`${t("backtest.safetyOrders")} (DCA)`}
                      tooltip="Safety Orders (Dollar Cost Averaging) automatically buy more when price drops, lowering your average entry price. This helps turn losing positions into winners when price recovers."
                      tooltipUk="Safety Orders (усереднення долара) автоматично докуповують при падінні ціни, знижуючи середню ціну входу. Це допомагає перетворити збиткові позиції на прибуткові при відновленні ціни."
                      language={language}
                    />
                    <Toggle
                      checked={safetyOrderToggle}
                      onChange={setSafetyOrderToggle}
                      size="md"
                    />
                  </CardTitle>
                </CardHeader>
                {safetyOrderToggle && (
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium block mb-1.5">
                          <TooltipLabel
                            label={language === "uk" ? "Розмір SO ($)" : "Safety Order Size ($)"}
                            tooltip="Amount in USD for each safety order. Larger orders = faster recovery but more capital needed."
                            tooltipUk="Сума в USD для кожного safety order. Більші ордери = швидше відновлення, але потрібно більше капіталу."
                            language={language}
                          />
                        </label>
                        <Input
                          type="number"
                          value={safetyOrderSize}
                          onChange={(e) => setSafetyOrderSize(parseFloat(e.target.value))}
                          min={1}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-1.5">
                          <TooltipLabel
                            label={language === "uk" ? "Макс. SO" : "Max Safety Orders"}
                            tooltip="Maximum number of safety orders per deal. More orders = can handle deeper dips but requires more capital. Common range: 1-7."
                            tooltipUk="Максимальна кількість safety orders на угоду. Більше ордерів = можна витримати глибші падіння, але потрібно більше капіталу. Типовий діапазон: 1-7."
                            language={language}
                          />
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
                        <label className="text-sm font-medium block mb-1.5">
                          <TooltipLabel
                            label={language === "uk" ? "Відхилення ціни (%)" : "Price Deviation (%)"}
                            tooltip="Price drop percentage to trigger the first safety order. Smaller = more frequent orders. Typical: 1-3%."
                            tooltipUk="Відсоток падіння ціни для активації першого safety order. Менше = частіші ордери. Типово: 1-3%."
                            language={language}
                          />
                        </label>
                        <Input
                          type="number"
                          value={priceDeviation}
                          onChange={(e) => setPriceDeviation(parseFloat(e.target.value))}
                          min={0.5}
                          step={0.5}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-1.5">
                          <TooltipLabel
                            label={language === "uk" ? "Масштаб обсягу" : "Volume Scale"}
                            tooltip="Multiplier for each subsequent safety order size. 1.5 = each SO is 50% larger than previous. Higher = more aggressive averaging."
                            tooltipUk="Множник для розміру кожного наступного SO. 1.5 = кожен SO на 50% більший за попередній. Вище = агресивніше усереднення."
                            language={language}
                          />
                        </label>
                        <Input
                          type="number"
                          value={safetyOrderVolumeScale}
                          onChange={(e) => setSafetyOrderVolumeScale(parseFloat(e.target.value))}
                          min={1}
                          step={0.1}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-1.5">
                          <TooltipLabel
                            label={language === "uk" ? "Масштаб кроку" : "Step Scale"}
                            tooltip="Multiplier for deviation between safety orders. 1.0 = equal spacing, 1.2 = each SO triggered at 20% larger deviation. Helps handle accelerating dips."
                            tooltipUk="Множник для відстані між safety orders. 1.0 = рівні інтервали, 1.2 = кожен SO активується на 20% більшому падінні. Допомагає при прискорених падіннях."
                            language={language}
                          />
                        </label>
                        <Input
                          type="number"
                          value={safetyOrderStepScale}
                          onChange={(e) => setSafetyOrderStepScale(parseFloat(e.target.value))}
                          min={1}
                          step={0.1}
                        />
                      </div>
                    </div>

                    {/* Safety Order Conditions */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-sm">
                          <TooltipLabel
                            label={language === "uk" ? "Умови Safety Order (необов'язково)" : "Safety Order Conditions (Optional)"}
                            tooltip="Additional indicator conditions to trigger safety orders. If set, safety orders will only execute when BOTH price deviation AND these conditions are met."
                            tooltipUk="Додаткові умови індикаторів для активації safety orders. Якщо задані, safety orders виконуються лише коли І падіння ціни І ці умови виконані."
                            language={language}
                          />
                        </h4>
                        <Button size="sm" variant="outline" onClick={() => addCondition("safety")}>
                          + {language === "uk" ? "Додати" : "Add"}
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {safetyConditions.map((cond, i) => (
                          <ConditionBuilder
                            key={i}
                            condition={cond}
                            language={language}
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
              {/* Next Step Button */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setActiveConfigTab("advanced")}
                  className="px-8 py-3 bg-black text-white font-bold flex items-center gap-2 group hover:bg-gray-800 transition-all"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
                >
                  {language === "uk" ? "Крок 3: Ризики та виконання" : "Step 3: Risk & Execution"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </>)}

          {/* Advanced Tab */}
          {activeConfigTab === "advanced" && (
            <>
              {/* Video Tutorial for Advanced Settings */}
              <VideoPlaceholder
                title="Mastering Safety Orders & DCA"
                titleUk="Майстерність Safety Orders та DCA"
                description="Dollar Cost Averaging strategies explained"
                descriptionUk="Стратегії усереднення вартості пояснено"
                duration="5:00"
                topic="advanced"
                language={language}
                variant="inline"
                className="mb-6"
              />

              {/* Advanced Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-purple-600" />
                    </div>
                    <TooltipLabel
                      label={language === "uk" ? "Розширені налаштування" : "Advanced Settings"}
                      tooltip="Fine-tune your strategy with additional controls for cooldowns, volume filters, and profit management."
                      tooltipUk="Налаштуйте стратегію з додатковими контролями для затримок, фільтрів обсягу та управління прибутком."
                      language={language}
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={minprofToggle}
                        onChange={setMinprofToggle}
                        size="md"
                      />
                      <TooltipLabel
                        label={language === "uk" ? "Мін. прибуток для виходу" : "Minimum Profit to Exit"}
                        tooltip="Only close position if profit exceeds this minimum %. Prevents closing too early on small gains. Useful with exit conditions."
                        tooltipUk="Закривати позицію тільки якщо прибуток перевищує цей мінімум %. Запобігає ранньому закриттю при малих прибутках."
                        language={language}
                        className="text-sm font-medium"
                      />
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
                      <label className="text-sm font-medium block mb-1.5">
                        <TooltipLabel
                          label={language === "uk" ? "Мін. денний обсяг ($)" : "Min Daily Volume ($)"}
                          tooltip="Only trade assets with daily volume above this threshold. Filters out illiquid assets. 0 = no filter."
                          tooltipUk="Торгувати лише активами з денним обсягом вище цього порогу. Відфільтровує неліквідні активи. 0 = без фільтра."
                          language={language}
                        />
                      </label>
                      <Input
                        type="number"
                        value={minDailyVolume}
                        onChange={(e) => setMinDailyVolume(parseFloat(e.target.value))}
                        min={0}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1.5">
                        <TooltipLabel
                          label={language === "uk" ? "Затримка між угодами (хв)" : "Cooldown Between Deals (min)"}
                          tooltip="Wait time after closing a deal before opening a new one on the same pair. Prevents overtrading. 0 = no cooldown."
                          tooltipUk="Час очікування після закриття угоди перед відкриттям нової на тій самій парі. Запобігає надмірній торгівлі. 0 = без затримки."
                          language={language}
                        />
                      </label>
                      <Input
                        type="number"
                        value={cooldownBetweenDeals}
                        onChange={(e) => setCooldownBetweenDeals(parseInt(e.target.value))}
                        min={0}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1.5">
                        <TooltipLabel
                          label={language === "uk" ? "Закрити угоду після (хв)" : "Close Deal After Timeout (min)"}
                          tooltip="Force close position after this many minutes regardless of profit/loss. Limits time in trade. 0 = disabled."
                          tooltipUk="Примусово закрити позицію після цієї кількості хвилин незалежно від прибутку/збитку. Обмежує час в угоді. 0 = вимкнено."
                          language={language}
                        />
                      </label>
                      <Input
                        type="number"
                        value={closeDealAfterTimeout}
                        onChange={(e) => setCloseDealAfterTimeout(parseInt(e.target.value))}
                        min={0}
                      />
                      <p className="text-xs text-gray-500 mt-1">0 = {language === "uk" ? "вимкнено" : "disabled"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>


              {/* Notification Preferences */}
              <Card className="bg-gray-50 border-2 border-gray-100" style={{ clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))' }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {language === "uk" ? "Сповіщення по завершенню" : "Completion Notification"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setNotifyVia('email')}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        notifyVia === 'email' 
                          ? 'bg-black text-white border-black' 
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotifyVia('telegram')}
                      disabled={!userProfile?.telegramId}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        notifyVia === 'telegram' 
                          ? 'bg-blue-500 text-white border-blue-500' 
                          : userProfile?.telegramId 
                            ? 'bg-white text-gray-700 border-gray-200 hover:border-blue-400' 
                            : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      }`}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                      Telegram
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotifyVia('both')}
                      disabled={!userProfile?.telegramId}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        notifyVia === 'both' 
                          ? 'bg-gradient-to-r from-black to-blue-500 text-white border-black' 
                          : userProfile?.telegramId 
                            ? 'bg-white text-gray-700 border-gray-200 hover:border-gray-400' 
                            : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      }`}
                    >
                      {language === "uk" ? "Обидва" : "Both"}
                    </button>
                  </div>
                  {!userProfile?.telegramId && (
                    <p className="text-xs text-gray-500 mt-2">
                      {language === "uk" 
                        ? "💡 Налаштуйте Telegram в профілі для отримання миттєвих сповіщень" 
                        : "💡 Set up Telegram in your profile to receive instant notifications"}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Run Button */}
              <button
                className="w-full py-4 bg-gradient-to-r from-black via-gray-900 to-black text-white font-bold text-lg relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
                onClick={runBacktest}
                disabled={loading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-transparent to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-50"></div>
                <div className="relative flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>{t("backtest.runningBacktest")}</span>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-emerald-400 animate-pulse"></div>
                        <div className="w-1.5 h-1.5 bg-emerald-400 animate-pulse delay-100"></div>
                        <div className="w-1.5 h-1.5 bg-emerald-400 animate-pulse delay-200"></div>
                      </div>
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-5 h-5 text-emerald-400" />
                      <span>{t("backtest.runBacktest")}</span>
                      <div className="w-4 h-4" /> {/* Spacer to center text with icon */}
                    </>
                  )}
                </div>
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
            </>)}
        </div>

        {/* Results Panel - only shown when there are results */}
        {results && (
        <div className="space-y-6">
            <>
              {/* Queue Status */}
              {results.status === 'queued' && (
                <Card className="bg-gray-50 border-2 border-gray-200" style={{ clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))' }}>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-black flex items-center justify-center mx-auto mb-3" style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                      <h3 className="font-bold text-lg text-gray-900">Backtest Queued</h3>
                      <p className="text-gray-600 mt-2">{results.message}</p>
                      {results.estimatedWait && (
                        <p className="text-sm text-gray-500 mt-2">
                          Estimated wait: ~{results.estimatedWait} minutes
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-4">
                        Check the floating monitor in the corner for live updates!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Performance Metrics */}
              {results.metrics && (
                <>
                  <div className="bg-black text-white" style={{ clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))' }}>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{t("backtest.likeResults")}</h3>
                          <p className="text-gray-300 text-sm">{t("backtest.saveToRunLive")}</p>
                        </div>
                        <Button
                          onClick={saveStrategy}
                          disabled={saving || saved}
                          className="bg-white text-black hover:bg-gray-100 font-bold"
                          style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
                        >
                          {saving ? t("backtest.saving") : saved ? t("backtest.saved") : t("backtest.saveStrategy")}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t("backtest.performanceMetrics")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-emerald-50 p-3" style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
                          <p className="text-xs text-emerald-600 font-medium">{t("backtest.netProfit")}</p>
                          <p className="text-xl font-bold text-emerald-700">{(results.metrics?.net_profit * 100).toFixed(1)}%</p>
                          <p className="text-sm text-emerald-600">{results.metrics?.net_profit_usd}</p>
                        </div>
                        <div className="bg-red-50 p-3" style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
                          <p className="text-xs text-red-600 font-medium">{t("backtest.maxDrawdown")}</p>
                          <p className="text-xl font-bold text-red-700">{(results.metrics?.max_drawdown * 100).toFixed(1)}%</p>
                        </div>
                        <div className="bg-gray-100 p-3" style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
                          <p className="text-xs text-gray-600 font-medium">{t("strategies.sharpeRatio")}</p>
                          <p className="text-xl font-bold text-gray-900">{results.metrics?.sharpe_ratio?.toFixed(2)}</p>
                        </div>
                        <div className="bg-emerald-50 p-3" style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
                          <p className="text-xs text-emerald-600 font-medium">{t("strategies.winRate")}</p>
                          <p className="text-xl font-bold text-emerald-700">{(results.metrics?.win_rate * 100).toFixed(0)}%</p>
                        </div>
                        <div className="bg-gray-50 p-3" style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
                          <p className="text-xs text-gray-600 font-medium">{t("backtest.totalTrades")}</p>
                          <p className="text-xl font-bold">{results.metrics?.total_trades}</p>
                        </div>
                        <div className="bg-gray-100 p-3" style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
                          <p className="text-xs text-gray-600 font-medium">{t("backtest.profitFactor")}</p>
                          <p className="text-xl font-bold text-gray-900">{results.metrics?.profit_factor}</p>
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
                            stroke="#10b981"
                            fill="#10b981"
                            fillOpacity={0.2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
        </div>
        )}
      </div >
    </div >
  );
}
