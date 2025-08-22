export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
