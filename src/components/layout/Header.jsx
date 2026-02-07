import { User } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="text-sm font-semibold text-gray-700">Offer Configuration</h1>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <User size={16} />
        <span>admin@nova.com</span>
      </div>
    </header>
  );
}
