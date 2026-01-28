"use client";

import { forwardRef, useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

// Custom Select/Dropdown with cut corners design
export const Select = forwardRef(({ 
  options = [], 
  value, 
  onChange, 
  placeholder = 'Select...', 
  className = '',
  size = "md",
  disabled = false,
}, ref) => {
  const sizes = {
    sm: { height: "h-9", text: "text-sm", padding: "px-3", cut: "5px" },
    md: { height: "h-11", text: "text-sm", padding: "px-4", cut: "6px" },
    lg: { height: "h-12", text: "text-base", padding: "px-4", cut: "8px" },
  };

  const { height, text, padding, cut } = sizes[size] || sizes.md;
  const selectedOption = options.find(opt => (opt.value ?? opt) === value);
  const displayValue = selectedOption ? (selectedOption.label ?? selectedOption) : placeholder;

  return (
    <div className={`relative ${className}`} ref={ref}>
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={`
          w-full ${height} ${padding} pr-10 ${text}
          border-2 border-gray-200 bg-white text-gray-900 
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
          appearance-none cursor-pointer
          transition-all duration-200
          ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : "hover:border-gray-300"}
        `}
        style={{ clipPath: `polygon(0 0, calc(100% - ${cut}) 0, 100% ${cut}, 100% 100%, ${cut} 100%, 0 calc(100% - ${cut}))` }}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      <ChevronDown 
        className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none transition-transform`} 
      />
    </div>
  );
});

Select.displayName = "Select";

// Compact inline select for forms (smaller, minimal design)
export const SelectInline = forwardRef(({ 
  options = [], 
  value, 
  onChange, 
  className = '',
  disabled = false,
}, ref) => {
  return (
    <div className={`relative inline-block ${className}`} ref={ref}>
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={`
          h-8 pl-3 pr-7 text-xs font-medium
          border-2 border-gray-200 bg-white text-gray-700 
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
          appearance-none cursor-pointer
          transition-all duration-200
          ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : "hover:border-gray-300"}
        `}
        style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}
      >
        {options.map(opt => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
    </div>
  );
});

SelectInline.displayName = "SelectInline";