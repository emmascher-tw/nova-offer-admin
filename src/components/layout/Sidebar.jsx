import { NavLink } from 'react-router';
import { LayoutList, Plus, Sparkles } from 'lucide-react';

const links = [
  { to: '/offers', label: 'All Offers', icon: LayoutList },
  { to: '/offers/new', label: 'New Offer', icon: Plus },
];

export default function Sidebar() {
  return (
    <aside className="w-60 bg-gray-900 text-white flex flex-col min-h-screen">
      <div className="px-5 py-5 flex items-center gap-2">
        <Sparkles size={22} className="text-indigo-400" />
        <span className="text-lg font-bold tracking-tight">Nova Admin</span>
      </div>
      <nav className="flex-1 px-3 py-2 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-5 py-4 text-xs text-gray-500">v1.0.0</div>
    </aside>
  );
}
