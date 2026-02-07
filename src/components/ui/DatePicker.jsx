import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function DatePicker({ value, onChange, error, ...props }) {
  return (
    <ReactDatePicker
      selected={value ? new Date(value) : null}
      onChange={(date) => onChange(date ? date.toISOString() : '')}
      dateFormat="yyyy-MM-dd"
      showTimeSelect={false}
      className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
        error ? 'border-red-300' : 'border-gray-300'
      }`}
      wrapperClassName="w-full"
      {...props}
    />
  );
}
