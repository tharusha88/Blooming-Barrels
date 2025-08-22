import React from "react";

// Card: Add 'card' class for CSS compatibility
export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`card bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col h-full transition-transform duration-200 hover:scale-105 hover:shadow-2xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// CardContent: Add 'card-content' class for CSS compatibility
export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={`card-content p-5 flex flex-col gap-2 ${className}`} {...props}>
      {children}
    </div>
  );
}
