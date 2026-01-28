"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";

/**
 * InfoTooltip - Shows a tooltip on hover with dashed underline styling
 * Matches the Algotcha website design
 */
export function InfoTooltip({ text, textUk, language = "en", children }) {
  const [isVisible, setIsVisible] = useState(false);
  const displayText = language === "uk" && textUk ? textUk : text;

  return (
    <span 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <span className="border-b border-dashed border-gray-400 cursor-help">
        {children}
      </span>
      {isVisible && displayText && (
        <div className="absolute z-50 w-72 p-3 mt-2 text-sm text-gray-700 bg-white rounded-lg shadow-xl border border-gray-200 left-0 top-full">
          <div className="absolute -top-2 left-4 w-3 h-3 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
          <p className="leading-relaxed font-normal">{displayText}</p>
        </div>
      )}
    </span>
  );
}

/**
 * TooltipLabel - A label with built-in tooltip support
 * Supports bilingual tooltips with tooltip (English) and tooltipUk (Ukrainian)
 */
export function TooltipLabel({ label, tooltip, tooltipUk, language = "en", className = "" }) {
  const [isVisible, setIsVisible] = useState(false);
  const displayTooltip = language === "uk" && tooltipUk ? tooltipUk : tooltip;

  if (!tooltip && !tooltipUk) {
    return <span className={className}>{label}</span>;
  }

  return (
    <span 
      className={`relative inline-flex items-center gap-1 ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <span className="border-b border-dashed border-emerald-400 cursor-help hover:border-emerald-600 transition-colors">
        {label}
      </span>
      <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
      {isVisible && displayTooltip && (
        <div className="absolute z-50 w-72 p-3 mt-2 text-sm text-gray-700 bg-white rounded-xl shadow-xl border border-gray-100 left-0 top-full" style={{ marginTop: '24px' }}>
          <div className="absolute -top-2 left-4 w-3 h-3 bg-white border-l border-t border-gray-100 transform rotate-45"></div>
          <p className="leading-relaxed font-normal">{displayTooltip}</p>
        </div>
      )}
    </span>
  );
}
