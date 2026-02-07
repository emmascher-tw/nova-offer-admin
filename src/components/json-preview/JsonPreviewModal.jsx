import { useState } from 'react';
import { JsonView, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import { Copy, Check } from 'lucide-react';
import Modal from '../ui/Modal.jsx';

export default function JsonPreviewModal({ open, onClose, data, title }) {
  const [copied, setCopied] = useState(false);

  const jsonStr = data ? JSON.stringify(data, null, 2) : '';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal open={open} onClose={onClose} title={title || 'JSON Preview'} wide>
      <div className="flex justify-end mb-2">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="text-xs max-h-[60vh] overflow-auto bg-gray-50 rounded-lg p-4 border border-gray-200">
        {data && <JsonView data={data} style={defaultStyles} />}
      </div>
    </Modal>
  );
}
