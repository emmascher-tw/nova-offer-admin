import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Pencil, Copy, Trash2, FileJson } from 'lucide-react';

const actions = [
  { key: 'edit', label: 'Edit', icon: Pencil },
  { key: 'clone', label: 'Clone', icon: Copy },
  { key: 'viewJson', label: 'View JSON', icon: FileJson },
  { key: 'delete', label: 'Delete', icon: Trash2, danger: true },
];

export default function OfferActions({ onEdit, onClone, onDelete, onViewJson }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handlers = { edit: onEdit, clone: onClone, delete: onDelete, viewJson: onViewJson };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
      >
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-1 w-44 rounded-lg bg-white shadow-lg border border-gray-200 py-1">
          {actions.map(({ key, label, icon: Icon, danger }) => (
            <button
              key={key}
              onClick={() => { handlers[key]?.(); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
