"use client";

import { forwardRef, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";

// Custom dropdown with proper positioning
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
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const sizes = {
    sm: { height: "h-8", text: "text-sm", padding: "px-3 py-1.5" },
    md: { height: "h-10", text: "text-sm", padding: "px-3 py-2" },
    lg: { height: "h-12", text: "text-base", padding: "px-4 py-3" },
  };

  const { height, text, padding } = sizes[size] || sizes.md;
  const selectedOption = options.find(opt => (opt.value ?? opt) === value);
  const displayValue = selectedOption ? (selectedOption.label ?? selectedOption) : placeholder;

  // Update position when opened
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: Math.max(rect.width, 140),
      });
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClick = (e) => {
      if (buttonRef.current?.contains(e.target)) return;
      if (dropdownRef.current?.contains(e.target)) return;
      setIsOpen(false);
    };
    
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => { if (e.key === "Escape") setIsOpen(false); };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Close on scroll (but not when scrolling inside dropdown)
  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = (e) => {
      if (dropdownRef.current?.contains(e.target)) return;
      setIsOpen(false);
    };
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [isOpen]);

  const handleSelect = (optionValue) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
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
          ${error ? "border-red-500" : isOpen ? "border-emerald-500" : "border-gray-200 hover:border-gray-300"}
          ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : "cursor-pointer"}
          ${!selectedOption ? "text-gray-400" : "text-gray-900"}
        `}
      >
        <span className="truncate flex-1">{displayValue}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 ml-1 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && !disabled && typeof document !== 'undefined' && createPortal(
        <div 
          ref={dropdownRef}
          className="fixed bg-white border border-gray-200 shadow-lg max-h-60 overflow-auto rounded-lg py-1"
          style={{ 
            top: position.top,
            left: position.left,
            width: position.width,
            zIndex: 99999,
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
                  ${isSelected ? "bg-emerald-50 text-emerald-700" : "text-gray-700 hover:bg-gray-50"}
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

// Compact version
export const SelectInline = forwardRef(({ 
  options = [], 
  value, 
  onChange, 
  className = '',
  disabled = false,
  error = false,
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const selectedOption = options.find(opt => (opt.value ?? opt) === value);
  const displayValue = selectedOption ? (selectedOption.label ?? selectedOption) : "Select";

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 2,
        left: rect.left,
        width: Math.max(rect.width, 100),
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (buttonRef.current?.contains(e.target)) return;
      if (dropdownRef.current?.contains(e.target)) return;
      setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = (e) => {
      if (dropdownRef.current?.contains(e.target)) return;
      setIsOpen(false);
    };
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [isOpen]);

  const handleSelect = (optionValue) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        ref={(el) => { buttonRef.current = el; if (ref) ref.current = el; }}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          h-8 px-3 text-xs font-medium rounded
          border-2 bg-white text-left
          flex items-center gap-1
          ${error ? "border-red-500" : isOpen ? "border-emerald-500" : "border-gray-200 hover:border-gray-300"}
          ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : "cursor-pointer"}
          text-gray-700
        `}
      >
        <span className="truncate">{displayValue}</span>
        <ChevronDown className={`w-3 h-3 text-gray-400 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && !disabled && typeof document !== 'undefined' && createPortal(
        <div 
          ref={dropdownRef}
          className="fixed bg-white border border-gray-200 shadow-lg max-h-48 overflow-auto rounded-lg py-1"
          style={{ 
            top: position.top,
            left: position.left,
            minWidth: position.width,
            zIndex: 99999,
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
                  w-full px-3 py-1.5 text-left text-xs font-medium
                  flex items-center justify-between
                  ${isSelected ? "bg-emerald-50 text-emerald-700" : "text-gray-700 hover:bg-gray-50"}
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
