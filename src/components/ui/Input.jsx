import { forwardRef } from 'react';

const Input = forwardRef(({ className = '', error, ...props }, ref) => (
  <input
    ref={ref}
    className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 ${
      error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
    } ${className}`}
    {...props}
  />
));

Input.displayName = 'Input';
export default Input;
