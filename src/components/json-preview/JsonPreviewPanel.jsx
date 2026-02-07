import { useWatch } from 'react-hook-form';
import { JsonView, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import { X, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { offerSchema } from '../../schemas/offerSchema.js';
import useUiStore from '../../stores/uiStore.js';

export default function JsonPreviewPanel({ control }) {
  const formValues = useWatch({ control });
  const setJsonPanelOpen = useUiStore((s) => s.setJsonPanelOpen);
  const [copied, setCopied] = useState(false);

  const parsed = offerSchema.safeParse(formValues);
  const data = parsed.success ? parsed.data : formValues;

  const jsonStr = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-xl z-40 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700">JSON Preview</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-500 transition-colors"
            title="Copy JSON"
          >
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </button>
          <button
            onClick={() => setJsonPanelOpen(false)}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {!parsed.success && (
          <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
            Validation errors present — showing raw form values.
          </div>
        )}
        <div className="text-xs">
          <JsonView data={data} style={defaultStyles} />
        </div>
      </div>
    </div>
  );
}
