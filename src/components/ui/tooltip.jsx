"use client";

import { useState } from "react";

export function Tooltip({ children, content }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute z-50 w-64 p-2 mt-1 text-xs text-white bg-gray-900 rounded-lg shadow-lg left-0 top-full whitespace-normal">
          {content}
        </div>
      )}
    </div>
  );
}

export function InfoTooltip({ text }) {
  return (
    <Tooltip content={text}>
      <span className="ml-1 cursor-help text-blue-500 hover:text-blue-600 select-none">
        ℹ️
      </span>
    </Tooltip>
  );
}

