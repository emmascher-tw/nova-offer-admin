import { useState } from 'react';
import { ChevronDown, ChevronRight, RotateCcw } from 'lucide-react';
import { JsonView, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import { formatDateTime } from '../../utils/formatDate.js';

export default function VersionRow({ version, onRestore }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
      >
        {expanded ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">v{version.version}</span>
            <span className="text-xs text-gray-400">{formatDateTime(version.saved_at)}</span>
          </div>
          <div className="text-xs text-gray-500 truncate">{version.change_summary}</div>
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">by {version.saved_by}</span>
            {onRestore && (
              <button
                type="button"
                onClick={() => onRestore(version)}
                className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <RotateCcw size={12} /> Restore
              </button>
            )}
          </div>
          <div className="text-xs max-h-60 overflow-auto bg-gray-50 rounded-lg p-3 border border-gray-200">
            <JsonView data={version.offer_config_snapshot} style={defaultStyles} />
          </div>
        </div>
      )}
    </div>
  );
}
