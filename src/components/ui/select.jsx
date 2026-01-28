"use client";

import { forwardRef, useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

// Fully custom dropdown (no native select) with cut corners design
export const Select = forwardRef(({ 
  options = [], 
  value, 
  onChange, 
  placeholder = 'Select...', 
  className = '',
  size = "md",
  disabled = false,
  error = false,
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const sizes = {
    sm: { height: "h-9", text: "text-sm", padding: "px-3 py-2", cut: "5px", dropdownCut: "8px" },
    md: { height: "h-11", text: "text-sm", padding: "px-4 py-3", cut: "6px", dropdownCut: "10px" },
    lg: { height: "h-12", text: "text-base", padding: "px-4 py-3", cut: "8px", dropdownCut: "12px" },
  };

  const { height, text, padding, cut, dropdownCut } = sizes[size] || sizes.md;
  const selectedOption = options.find(opt => (opt.value ?? opt) === value);
  const displayValue = selectedOption ? (selectedOption.label ?? selectedOption) : placeholder;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleSelect = (optionValue) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger button */}
      <button
        ref={ref}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full ${height} ${padding} pr-10 ${text}
          border-2 bg-white text-left font-medium
          flex items-center justify-between
          transition-all duration-200
          ${error 
            ? "border-red-500 focus:ring-red-500" 
            : isOpen 
              ? "border-emerald-500 ring-2 ring-emerald-500" 
              : "border-gray-200 hover:border-gray-300"
          }
          ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : "cursor-pointer"}
          ${!selectedOption ? "text-gray-400" : "text-gray-900"}
        `}
        style={{ clipPath: `polygon(0 0, calc(100% - ${cut}) 0, 100% ${cut}, 100% 100%, ${cut} 100%, 0 calc(100% - ${cut}))` }}
      >
        <span className="truncate">{displayValue}</span>
        <ChevronDown 
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && !disabled && (
        <div 
          className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 shadow-xl max-h-60 overflow-auto"
          style={{ clipPath: `polygon(0 0, calc(100% - ${dropdownCut}) 0, 100% ${dropdownCut}, 100% 100%, ${dropdownCut} 100%, 0 calc(100% - ${dropdownCut}))` }}
        >
          {options.map((opt, idx) => {
            const optValue = opt.value ?? opt;
            const optLabel = opt.label ?? opt;
            const isSelected = optValue === value;
            
            return (
              <button
                key={optValue}
                type="button"
                onClick={() => handleSelect(optValue)}
                className={`
                  w-full px-4 py-2.5 text-left ${text} font-medium
                  flex items-center justify-between
                  transition-colors duration-150
                  ${isSelected 
                    ? "bg-emerald-50 text-emerald-700" 
                    : "text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                <span>{optLabel}</span>
                {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
});

Select.displayName = "Select";

// Compact inline custom dropdown for forms (smaller, minimal design)
export const SelectInline = forwardRef(({ 
  options = [], 
  value, 
  onChange, 
  className = '',
  disabled = false,
  error = false,
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find(opt => (opt.value ?? opt) === value);
  const displayValue = selectedOption ? (selectedOption.label ?? selectedOption) : "Select";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      {/* Trigger button */}
      <button
        ref={ref}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          h-8 pl-3 pr-7 text-xs font-medium
          border-2 bg-white text-left
          flex items-center
          transition-all duration-200
          ${error 
            ? "border-red-500" 
            : isOpen 
              ? "border-emerald-500" 
              : "border-gray-200 hover:border-gray-300"
          }
          ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : "cursor-pointer"}
          text-gray-700
        `}
        style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}
      >
        <span className="truncate">{displayValue}</span>
        <ChevronDown 
          className={`absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && !disabled && (
        <div 
          className="absolute z-50 w-full min-w-[140px] mt-1 bg-white border-2 border-gray-200 shadow-lg max-h-48 overflow-auto"
          style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
        >
          {options.map((opt) => {
            const optValue = opt.value ?? opt;
            const optLabel = opt.label ?? opt;
            const isSelected = optValue === value;
            
            return (
              <button
                key={optValue}
                type="button"
                onClick={() => handleSelect(optValue)}
                className={`
                  w-full px-3 py-2 text-left text-xs font-medium
                  flex items-center justify-between
                  transition-colors duration-150
                  ${isSelected 
                    ? "bg-emerald-50 text-emerald-700" 
                    : "text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                <span>{optLabel}</span>
                {isSelected && <Check className="w-3 h-3 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
});

SelectInline.displayName = "SelectInline";
