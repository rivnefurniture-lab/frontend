"use client";

import { forwardRef } from "react";

// Custom Toggle Switch with cut corners design
export const Toggle = forwardRef(({ 
  checked, 
  onChange, 
  disabled = false,
  size = "md",
  className = "",
  ...props 
}, ref) => {
  const sizes = {
    sm: { track: "w-9 h-5", thumb: "w-4 h-4", translate: "translate-x-4" },
    md: { track: "w-11 h-6", thumb: "w-5 h-5", translate: "translate-x-5" },
    lg: { track: "w-14 h-7", thumb: "w-6 h-6", translate: "translate-x-7" },
  };

  const { track, thumb, translate } = sizes[size] || sizes.md;

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!checked)}
      className={`
        ${track}
        relative inline-flex items-center
        transition-all duration-300 ease-in-out
        ${checked 
          ? "bg-emerald-500" 
          : "bg-gray-200"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-90"}
        ${className}
      `}
      style={{ 
        clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' 
      }}
      {...props}
    >
      <span
        className={`
          ${thumb}
          inline-block bg-white shadow-sm
          transform transition-transform duration-300 ease-in-out
          ${checked ? translate : "translate-x-0.5"}
        `}
        style={{ 
          clipPath: 'polygon(2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)' 
        }}
      />
    </button>
  );
});

Toggle.displayName = "Toggle";

// Toggle with label
export const ToggleWithLabel = forwardRef(({ 
  checked, 
  onChange, 
  label,
  description,
  disabled = false,
  size = "md",
  labelPosition = "right",
  className = "",
  ...props 
}, ref) => {
  const content = (
    <div className="flex-1">
      <span className="font-medium text-sm text-gray-900">{label}</span>
      {description && (
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      )}
    </div>
  );

  return (
    <label className={`flex items-center gap-3 cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}>
      {labelPosition === "left" && content}
      <Toggle 
        ref={ref}
        checked={checked} 
        onChange={onChange} 
        disabled={disabled}
        size={size}
        {...props}
      />
      {labelPosition === "right" && content}
    </label>
  );
});

ToggleWithLabel.displayName = "ToggleWithLabel";
