import { forwardRef } from 'react';
import Input from './Input.jsx';

const NumberInput = forwardRef(({ onChange, ...props }, ref) => (
  <Input
    ref={ref}
    type="number"
    step="any"
    onChange={(e) => {
      const val = e.target.value;
      onChange?.(val === '' ? '' : Number(val));
    }}
    {...props}
  />
));

NumberInput.displayName = 'NumberInput';
export default NumberInput;
