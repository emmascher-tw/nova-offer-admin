import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ className = '' }) {
  return (
    <div className={`flex items-center justify-center py-16 ${className}`}>
      <Loader2 className="animate-spin text-indigo-600" size={32} />
    </div>
  );
}
