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
    const baseClass = 'px-5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-all duration-200 border-2 shadow-sm';
    const isSelected = selected === value;

    if (value === 'all') {
      return `${baseClass} ${
        isSelected
          ? 'bg-[#E20074] text-white border-[#E20074]'
          : 'bg-white text-[#333333] border-gray-200 hover:border-[#E20074]'
      }`;
    }

    const colorMap = {
      magenta: {
        selected: 'bg-[#E20074] text-white border-[#E20074]',
        unselected: 'bg-white text-[#E20074] border-gray-200 hover:border-[#E20074]',
      },
      gray: {
        selected: 'bg-[#666666] text-white border-[#666666]',
        unselected: 'bg-white text-[#666666] border-gray-200 hover:border-[#666666]',
      },
      lightGray: {
        selected: 'bg-[#999999] text-white border-[#999999]',
        unselected: 'bg-white text-[#999999] border-gray-200 hover:border-[#999999]',
      },
    };

    const color = value === 'Very Important' ? 'magenta' : value === 'Important' ? 'gray' : 'lightGray';
    return `${baseClass} ${isSelected ? colorMap[color].selected : colorMap[color].unselected}`;
  };

  return (
    <div className="bg-white rounded-sm border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <Filter size={18} className="text-[#E20074]" />
        <h3 className="text-xs font-black text-[#333333] uppercase tracking-[0.2em]">Filtrar por Importância</h3>
      </div>
      <div className="flex flex-wrap gap-4">
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
