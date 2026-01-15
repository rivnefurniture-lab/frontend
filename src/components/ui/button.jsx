import { cn } from "@/lib/utils";

export function Button({
  as: Comp = "button",
  className,
  variant = "primary",
  size = "md",
  ...props
}) {
  const base =
    "tap inline-flex items-center justify-center font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer [clip-path:polygon(0_0,calc(100%-6px)_0,100%_6px,100%_100%,6px_100%,0_calc(100%-6px))]";

  const variants = {
    primary: "bg-black text-white hover:bg-gray-800 focus:ring-gray-600",
    secondary:
      "bg-white text-gray-900 border-2 border-gray-200 hover:bg-gray-50 hover:border-black focus:ring-gray-300",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-5",
    lg: "h-12 px-6 text-lg",
  };

  return (
    <Comp
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
