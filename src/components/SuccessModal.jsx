"use client";

import { useEffect } from "react";

export default function SuccessModal({
  open,
  onClose,
  title,
  subtitle,
  details = [],
  footer,
  icon = "success",
}) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onClose]);

  if (!open) return null;

  const icons = {
    success: (
      <div className="w-16 h-16 bg-emerald-500 flex items-center justify-center mx-auto mb-4" style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    ),
    queue: (
      <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-4" style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    ),
    error: (
      <div className="w-16 h-16 bg-red-500 flex items-center justify-center mx-auto mb-4" style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    ),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative bg-white w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200"
        style={{clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'}}
      >
        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10" style={{clipPath: 'polygon(100% 0, 0 0, 100% 100%)'}} />
        
        {/* Icon */}
        {icons[icon] || icons.success}
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          {title}
        </h2>
        
        {/* Subtitle */}
        {subtitle && (
          <p className="text-gray-600 text-center mb-6">
            {subtitle}
          </p>
        )}
        
        {/* Details */}
        {details.length > 0 && (
          <div className="space-y-3 mb-6">
            {details.map((detail, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 border-2 border-gray-100"
                style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}
              >
                <span className="text-gray-600 text-sm font-medium">{detail.label}</span>
                <span className="font-bold text-gray-900">{detail.value}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Footer text */}
        {footer && (
          <p className="text-sm text-gray-500 text-center mb-6 px-4">
            {footer}
          </p>
        )}
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-6 bg-black text-white font-bold hover:bg-gray-800 transition-colors"
          style={{clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'}}
        >
          Got it
        </button>
      </div>
    </div>
  );
}

