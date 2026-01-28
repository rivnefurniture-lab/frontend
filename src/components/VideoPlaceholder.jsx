"use client";

import { useState } from "react";
import { Play, X, Clock, BookOpen } from "lucide-react";

/**
 * Premium Video Tutorial Placeholder Component
 * 
 * Displays an elegant placeholder for tutorial videos with:
 * - Glassmorphism effect
 * - Smooth animations
 * - Duration indicator
 * - Expandable modal (future)
 */
export default function VideoPlaceholder({ 
  title,
  titleUk,
  description,
  descriptionUk,
  duration = "2:30",
  topic = "tutorial",
  language = "en",
  variant = "inline", // "inline" | "card" | "banner"
  className = "",
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const displayTitle = language === "uk" ? (titleUk || title) : title;
  const displayDesc = language === "uk" ? (descriptionUk || description) : description;
  
  const topicIcons = {
    tutorial: <BookOpen className="w-4 h-4" />,
    setup: <Clock className="w-4 h-4" />,
    advanced: <BookOpen className="w-4 h-4" />,
  };

  if (variant === "banner") {
    return (
      <div 
        className={`relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-[1px] ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative bg-gradient-to-r from-blue-950/90 via-indigo-950/90 to-purple-950/90 backdrop-blur-xl rounded-xl p-4">
          {/* Animated gradient orbs */}
          <div className={`absolute -top-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl transition-transform duration-700 ${isHovered ? 'scale-150' : 'scale-100'}`} />
          <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl transition-transform duration-700 ${isHovered ? 'scale-150' : 'scale-100'}`} />
          
          <div className="relative flex items-center gap-4">
            {/* Play button */}
            <button 
              onClick={() => setShowModal(true)}
              className={`flex-shrink-0 w-14 h-14 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-105 group`}
            >
              <Play className="w-6 h-6 text-white fill-white group-hover:scale-110 transition-transform" />
            </button>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-white/10 rounded text-xs font-medium text-blue-200 flex items-center gap-1">
                  {topicIcons[topic]}
                  {language === "uk" ? "Відео" : "Video Tutorial"}
                </span>
                <span className="text-xs text-white/60">{duration}</span>
              </div>
              <h4 className="font-semibold text-white truncate">{displayTitle}</h4>
              {displayDesc && (
                <p className="text-sm text-white/70 truncate">{displayDesc}</p>
              )}
            </div>
            
            {/* CTA */}
            <button 
              onClick={() => setShowModal(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm font-medium transition-all"
            >
              {language === "uk" ? "Дивитись" : "Watch"}
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (variant === "card") {
    return (
      <div 
        className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 group cursor-pointer ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setShowModal(true)}
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Video thumbnail placeholder */}
        <div className="aspect-video relative bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />
          
          {/* Play button */}
          <div className={`w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 ${isHovered ? 'scale-110 bg-white/20' : ''}`}>
            <Play className={`w-7 h-7 text-white fill-white transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} />
          </div>
          
          {/* Duration badge */}
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs font-medium text-white">
            {duration}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs font-medium">
              {language === "uk" ? "Навчання" : "Tutorial"}
            </span>
          </div>
          <h4 className="font-semibold text-white mb-1">{displayTitle}</h4>
          {displayDesc && (
            <p className="text-sm text-gray-400">{displayDesc}</p>
          )}
        </div>
      </div>
    );
  }
  
  // Default inline variant
  return (
    <div 
      className={`relative overflow-hidden bg-gradient-to-r from-slate-50 to-gray-50 border-2 border-dashed border-gray-200 hover:border-emerald-300 rounded-xl p-4 transition-all duration-300 group cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setShowModal(true)}
    >
      {/* Subtle animated gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r from-emerald-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      <div className="relative flex items-center gap-4">
        {/* Play icon */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 transition-transform duration-300 ${isHovered ? 'scale-105' : ''}`}>
          <Play className="w-5 h-5 text-white fill-white ml-0.5" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              {language === "uk" ? "Відео" : "Video"}
            </span>
            <span className="text-xs text-gray-400">• {duration}</span>
          </div>
          <h4 className="font-medium text-gray-900 truncate">{displayTitle}</h4>
          {displayDesc && (
            <p className="text-sm text-gray-500 truncate">{displayDesc}</p>
          )}
        </div>
        
        {/* Arrow */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 group-hover:bg-emerald-100 flex items-center justify-center transition-all duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
          <svg className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact video hint that can be placed inline with form labels
 */
export function VideoHint({ 
  tooltip,
  tooltipUk,
  duration = "1:00",
  language = "en",
}) {
  const [isHovered, setIsHovered] = useState(false);
  const displayTooltip = language === "uk" ? (tooltipUk || tooltip) : tooltip;
  
  return (
    <div className="relative inline-flex">
      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="ml-1 w-5 h-5 rounded-full bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center transition-colors"
      >
        <Play className="w-2.5 h-2.5 text-emerald-600 fill-emerald-600 ml-0.5" />
      </button>
      
      {/* Tooltip */}
      {isHovered && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-50">
          <div className="flex items-center gap-2">
            <Play className="w-3 h-3 fill-white" />
            <span>{displayTooltip}</span>
            <span className="text-gray-400">({duration})</span>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-gray-900 rotate-45 -mt-1" />
        </div>
      )}
    </div>
  );
}
