import { Filter } from 'lucide-react';

export type ImportanceLevel = 'all' | 'Very Important' | 'Important' | 'Normal';

interface ImportanceFilterProps {
  selected: ImportanceLevel;
  onChange: (level: ImportanceLevel) => void;
}

export function ImportanceFilter({ selected, onChange }: ImportanceFilterProps) {
  const filters: { value: ImportanceLevel; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'Very Important', label: 'Muito Importante' },
    { value: 'Important', label: 'Importante' },
    { value: 'Normal', label: 'Normal' },
  ];

  const getButtonClass = (value: ImportanceLevel) => {
    const baseClass = 'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border shadow-sm';
    const isSelected = selected === value;

    if (value === 'all') {
      return `${baseClass} ${
        isSelected
          ? 'bg-magenta-600 text-white border-magenta-600'
          : 'bg-white text-gray-700 border-gray-200 hover:border-magenta-400'
      }`;
    }

    const colorMap = {
      red: {
        selected: 'bg-red-600 text-white border-red-600',
        unselected: 'bg-white text-red-600 border-red-200 hover:border-red-400',
      },
      amber: {
        selected: 'bg-amber-500 text-white border-amber-500',
        unselected: 'bg-white text-amber-600 border-amber-200 hover:border-amber-400',
      },
      gray: {
        selected: 'bg-gray-600 text-white border-gray-600',
        unselected: 'bg-white text-gray-600 border-gray-200 hover:border-gray-400',
      },
    };

    const color = value === 'Very Important' ? 'red' : value === 'Important' ? 'amber' : 'gray';
    return `${baseClass} ${isSelected ? colorMap[color].selected : colorMap[color].unselected}`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={18} className="text-magenta-600" />
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Filtrar por Importância</h3>
      </div>
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onChange(filter.value)}
            className={getButtonClass(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
