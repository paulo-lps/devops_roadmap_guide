import { Filter } from 'lucide-react';

export type ImportanceLevel = 'all' | 'Very Important' | 'Important' | 'Normal';

interface ImportanceFilterProps {
  selected: ImportanceLevel;
  onChange: (level: ImportanceLevel) => void;
}

export function ImportanceFilter({ selected, onChange }: ImportanceFilterProps) {
  const filters: { value: ImportanceLevel; label: string; color: string }[] = [
    { value: 'all', label: 'Todos', color: 'gray' },
    { value: 'Very Important', label: 'Muito Importante', color: 'red' },
    { value: 'Important', label: 'Importante', color: 'yellow' },
    { value: 'Normal', label: 'Normal', color: 'gray' },
  ];

  const getButtonClass = (value: ImportanceLevel) => {
    const baseClass = 'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border';
    const isSelected = selected === value;

    if (value === 'all') {
      return `${baseClass} ${
        isSelected
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
      }`;
    }

    const colorMap = {
      red: {
        selected: 'bg-red-100 text-red-700 border-red-300',
        unselected: 'bg-white text-red-600 border-red-200 hover:border-red-400',
      },
      yellow: {
        selected: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        unselected: 'bg-white text-yellow-600 border-yellow-200 hover:border-yellow-400',
      },
      gray: {
        selected: 'bg-gray-100 text-gray-700 border-gray-300',
        unselected: 'bg-white text-gray-600 border-gray-200 hover:border-gray-400',
      },
    };

    const color = value === 'Very Important' ? 'red' : value === 'Important' ? 'yellow' : 'gray';
    return `${baseClass} ${isSelected ? colorMap[color].selected : colorMap[color].unselected}`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter size={18} className="text-gray-600" />
        <h3 className="text-sm font-semibold text-gray-900">Filtrar por Importância</h3>
      </div>
      <div className="flex flex-wrap gap-2">
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
