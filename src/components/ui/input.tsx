import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputWidth?: "sm" | "md" | "lg" | "full" | "responsive";
  error?: boolean;
  inputSize?: "sm" | "md" | "lg";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputWidth = "full", error = false, inputSize = "md", ...props }, ref) => {
    const widthClass = {
      sm: "w-[160px]",
      md: "w-[244px]",
      lg: "w-[320px]",
      responsive: "w-full sm:w-[244px]",
      full: "w-full",
    }[inputWidth];

    const sizeClass = {
      sm: "h-9 px-3 text-sm",
      md: "h-11 px-4 text-sm",
      lg: "h-12 px-4 text-base",
    }[inputSize];

    return (
      <input
        ref={ref}
        className={cn(
          widthClass,
          sizeClass,
          "border-2 bg-white text-gray-900 font-medium placeholder-gray-400",
          "focus:outline-none focus:ring-2 transition-all duration-200",
          "[clip-path:polygon(0_0,calc(100%-6px)_0,100%_6px,100%_100%,6px_100%,0_calc(100%-6px))]",
          error 
            ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
            : "border-gray-200 focus:ring-emerald-500 focus:border-emerald-500 hover:border-gray-300",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

// Input with label and error message
interface InputFieldProps extends InputProps {
  label?: string;
  required?: boolean;
  errorMessage?: string;
  hint?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, required, errorMessage, hint, className, ...props }, ref) => {
    return (
      <div className={className}>
        {label && (
          <label className="text-sm font-medium text-gray-700 block mb-1.5 flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <Input ref={ref} error={!!errorMessage} {...props} />
        {errorMessage && (
          <p className="text-xs text-red-500 mt-1 font-medium">{errorMessage}</p>
        )}
        {hint && !errorMessage && (
          <p className="text-xs text-gray-500 mt-1">{hint}</p>
        )}
      </div>
    );
  },
);

InputField.displayName = "InputField";
