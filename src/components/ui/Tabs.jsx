export default function Tabs({ tabs, activeTab, onChange, errors = {} }) {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex gap-0 -mb-px" aria-label="Tabs">
        {tabs.map((tab, idx) => {
          const isActive = activeTab === idx;
          const hasError = errors[idx];
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onChange(idx)}
              className={`relative px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
                isActive
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
              {hasError && (
                <span className="absolute top-2 right-1 h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
