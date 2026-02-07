import { FileText, ArrowRight } from 'lucide-react';
import { TEMPLATES, TEMPLATE_CATEGORIES } from '../../schemas/templates.js';

export default function TemplateSelector({ onSelect, onSkip }) {
  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-gray-900">Choose a Template</h2>
        <p className="text-sm text-gray-500 mt-1">
          Start with a pre-built template or build from scratch
        </p>
      </div>

      {TEMPLATE_CATEGORIES.map((category) => (
        <div key={category} className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 px-1">
            {category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TEMPLATES.filter((t) => t.category === category).map((template) => (
              <button
                key={template.key}
                type="button"
                onClick={() => onSelect(template)}
                className="group text-left p-4 rounded-xl border border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                    <FileText size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {template.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {template.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="text-center mt-8 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onSkip}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
        >
          Start from scratch <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
