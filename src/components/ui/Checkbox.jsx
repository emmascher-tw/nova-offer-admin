import { forwardRef } from 'react';

const Checkbox = forwardRef(({ label, className = '', ...props }, ref) => (
  <label className={`inline-flex items-center gap-2 cursor-pointer ${className}`}>
    <input
      ref={ref}
      type="checkbox"
      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
      {...props}
    />
    {label && <span className="text-sm text-gray-700">{label}</span>}
  </label>
));

Checkbox.displayName = 'Checkbox';
export default Checkbox;
