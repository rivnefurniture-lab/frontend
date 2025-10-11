import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputWidth?: "sm" | "md" | "lg" | "responsive";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputWidth = "full", ...props }, ref) => {
    const widthClass = {
      sm: "w-[160px]",
      md: "w-[244px]",
      lg: "w-[320px]",
      responsive: "w-full sm:w-[244px]",
      full: "w-full",
    }[inputWidth];

    return (
      <input
        ref={ref}
        className={cn(
          widthClass,
          "h-11 px-4 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
