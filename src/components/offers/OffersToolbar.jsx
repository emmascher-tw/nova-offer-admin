import { useNavigate } from 'react-router';
import { Search, Plus } from 'lucide-react';
import Button from '../ui/Button.jsx';

const templateTypes = [
  { value: '', label: 'All Templates' },
  { value: 'single_dine', label: 'Single Dine' },
  { value: 'single_dine_spend', label: 'Single Dine Spend' },
  { value: 'single_spend', label: 'Single Spend' },
  { value: 'spend_across_dines', label: 'Spend Across Dines' },
  { value: 'frequency_time', label: 'Frequency (Time)' },
  { value: 'frequency_recurring', label: 'Frequency (Recurring)' },
  { value: 'single_activity', label: 'Single Activity' },
  { value: 'two_action', label: '2-Action' },
  { value: 'three_action', label: '3-Action' },
];

export default function OffersToolbar({ search, onSearchChange, typeFilter, onTypeFilterChange }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search offers..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <select
        value={typeFilter}
        onChange={(e) => onTypeFilterChange(e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        {templateTypes.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>
      <Button onClick={() => navigate('/offers/new')}>
        <Plus size={16} /> New Offer
      </Button>
    </div>
  );
}
