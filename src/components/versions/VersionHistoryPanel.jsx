import { X, History } from 'lucide-react';
import useVersionHistory from '../../hooks/useVersionHistory.js';
import useUiStore from '../../stores/uiStore.js';
import VersionRow from './VersionRow.jsx';
import LoadingSpinner from '../ui/LoadingSpinner.jsx';

export default function VersionHistoryPanel({ offerId, onRestore }) {
  const { versions, loading, error } = useVersionHistory(offerId);
  const setVersionPanelOpen = useUiStore((s) => s.setVersionPanelOpen);

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-xl z-40 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <History size={16} className="text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-700">Version History</h3>
        </div>
        <button
          onClick={() => setVersionPanelOpen(false)}
          className="p-1.5 rounded hover:bg-gray-200 text-gray-500 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        {loading && <LoadingSpinner />}
        {error && <div className="p-4 text-sm text-red-600">Failed to load versions.</div>}
        {!loading && versions.length === 0 && (
          <div className="p-4 text-sm text-gray-500">No version history found.</div>
        )}
        {versions.map((v) => (
          <VersionRow key={v.id} version={v} onRestore={onRestore} />
        ))}
      </div>
    </div>
  );
}
