import React from "react";

export function Select({ value, onValueChange, children, className = "", defaultValue, ...props }) {
  return (
    <select
      className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 ${className}`}
      value={value}
      onChange={e => onValueChange && onValueChange(e.target.value)}
      defaultValue={defaultValue}
      {...props}
    >
      {children}
    </select>
  );
}

// These subcomponents are for API compatibility only and do not render extra DOM.
export function SelectTrigger({ children, className = "", ...props }) {
  return <>{children}</>;
}
export function SelectValue({ placeholder, ...props }) {
  return <option disabled value="">{placeholder}</option>;
}
export function SelectContent({ children }) {
  return <>{children}</>;
}
export function SelectItem({ value, children, ...props }) {
  return <option value={value} {...props}>{children}</option>;
}
