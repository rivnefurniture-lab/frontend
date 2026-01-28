"use client";

import { forwardRef, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";

// Fully custom dropdown with portal for proper z-index handling
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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  const sizes = {
    sm: { height: "h-8", text: "text-sm", padding: "px-3 py-1.5", cut: "4px" },
    md: { height: "h-10", text: "text-sm", padding: "px-3 py-2", cut: "5px" },
    lg: { height: "h-12", text: "text-base", padding: "px-4 py-3", cut: "6px" },
  };

  const { height, text, padding, cut } = sizes[size] || sizes.md;
  const selectedOption = options.find(opt => (opt.value ?? opt) === value);
  const displayValue = selectedOption ? (selectedOption.label ?? selectedOption) : placeholder;

  // Calculate dropdown position
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

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
        ref={(el) => { buttonRef.current = el; if (ref) ref.current = el; }}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full ${height} ${padding} pr-8 ${text}
          border-2 bg-white text-left font-medium rounded
          flex items-center
          transition-all duration-200
          ${error 
            ? "border-red-500" 
            : isOpen 
              ? "border-emerald-500" 
              : "border-gray-200 hover:border-gray-300"
          }
          ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : "cursor-pointer"}
          ${!selectedOption ? "text-gray-400" : "text-gray-900"}
        `}
      >
        <span className="truncate flex-1">{displayValue}</span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ml-1 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {/* Dropdown menu - Portal to body */}
      {isOpen && !disabled && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed bg-white border-2 border-gray-200 shadow-xl max-h-60 overflow-auto rounded-lg"
          style={{ 
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            zIndex: 9999,
          }}
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
                  w-full px-3 py-2 text-left ${text} font-medium
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
        </div>,
        document.body
      )}
    </div>
  );
});

Select.displayName = "Select";

// Compact inline custom dropdown - also uses portal
export const SelectInline = forwardRef(({ 
  options = [], 
  value, 
  onChange, 
  className = '',
  disabled = false,
  error = false,
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  const selectedOption = options.find(opt => (opt.value ?? opt) === value);
  const displayValue = selectedOption ? (selectedOption.label ?? selectedOption) : "Select";

  // Calculate dropdown position
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 2,
        left: rect.left + window.scrollX,
        width: Math.max(rect.width, 120),
      });
    }
  }, [isOpen]);

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
        ref={(el) => { buttonRef.current = el; if (ref) ref.current = el; }}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          h-8 pl-3 pr-6 text-xs font-medium rounded
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
      >
        <span className="truncate">{displayValue}</span>
        <ChevronDown 
          className={`w-3 h-3 text-gray-400 ml-1 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown menu - Portal to body */}
      {isOpen && !disabled && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed bg-white border-2 border-gray-200 shadow-lg max-h-48 overflow-auto rounded-lg"
          style={{ 
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            minWidth: dropdownPosition.width,
            zIndex: 9999,
          }}
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
        </div>,
        document.body
      )}
    </div>
  );
});

SelectInline.displayName = "SelectInline";
