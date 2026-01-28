"use client";

import { forwardRef } from "react";
import { Check } from "lucide-react";

// Custom Checkbox with cut corners design
export const Checkbox = forwardRef(({ 
  checked, 
  onChange, 
  disabled = false,
  size = "md",
  className = "",
  ...props 
}, ref) => {
  const sizes = {
    sm: { box: "w-4 h-4", icon: "w-2.5 h-2.5", cut: "3px" },
    md: { box: "w-5 h-5", icon: "w-3 h-3", cut: "4px" },
    lg: { box: "w-6 h-6", icon: "w-4 h-4", cut: "5px" },
  };

  const { box, icon, cut } = sizes[size] || sizes.md;

  return (
    <button
      ref={ref}
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!checked)}
      className={`
        ${box} 
        flex items-center justify-center 
        border-2 transition-all duration-200
        ${checked 
          ? "bg-black border-black text-white" 
          : "bg-white border-gray-300 hover:border-gray-400"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      style={{ 
        clipPath: `polygon(0 0, calc(100% - ${cut}) 0, 100% ${cut}, 100% 100%, ${cut} 100%, 0 calc(100% - ${cut}))` 
      }}
      {...props}
    >
      {checked && <Check className={icon} strokeWidth={3} />}
    </button>
  );
});

Checkbox.displayName = "Checkbox";

// Checkbox with label
export const CheckboxWithLabel = forwardRef(({ 
  checked, 
  onChange, 
  label,
  description,
  disabled = false,
  size = "md",
  className = "",
  ...props 
}, ref) => {
  return (
    <label className={`flex items-start gap-3 cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}>
      <Checkbox 
        ref={ref}
        checked={checked} 
        onChange={onChange} 
        disabled={disabled}
        size={size}
        {...props}
      />
      <div className="flex-1">
        <span className="font-medium text-sm text-gray-900">{label}</span>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
    </label>
  );
});

CheckboxWithLabel.displayName = "CheckboxWithLabel";
