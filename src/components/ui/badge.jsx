export function Badge({ children, variant = "default" }) {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-yellow-50 text-yellow-700",
    error: "bg-red-50 text-red-700",
    outline: "bg-white border-2 border-gray-200 text-gray-700",
  };
  
  return (
    <span 
      className={`inline-flex items-center px-3 py-1 text-xs font-medium ${variants[variant] || variants.default}`}
      style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}
    >
      {children}
    </span>
  );
}