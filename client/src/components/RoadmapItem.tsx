import { Check } from 'lucide-react';
import { useState } from 'react';
import { RoadmapItem as RoadmapItemType } from '@/hooks/useRoadmapProgress';

interface RoadmapItemProps {
  item: RoadmapItemType;
  onToggle: () => void;
  categoryId: number;
}

export function RoadmapItem({ item, onToggle }: RoadmapItemProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    if (!item.completed) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }
    onToggle();
  };
  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'Very Important':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Important':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Normal':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
        item.completed
          ? 'bg-green-50 border-green-200 hover:border-green-300'
          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}
      onClick={handleToggle}
    >
      {/* Checkbox */}
      <div
        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${isAnimating ? 'animate-checkmark' : ''} ${
          item.completed
            ? 'bg-green-500 border-green-500'
            : 'border-gray-300 hover:border-green-400'
        }`}
      >
        {item.completed && <Check size={16} className="text-white" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium transition-all duration-200 ${
            item.completed
              ? 'text-gray-500 line-through'
              : 'text-gray-900'
          }`}
        >
          {item.name}
        </p>
      </div>

      {/* Importance Badge */}
      <div className={`flex-shrink-0 px-2.5 py-1 rounded text-xs font-semibold border ${getImportanceColor(item.importance)}`}>
        {item.importance === 'Very Important' ? 'Very Imp.' : item.importance === 'Important' ? 'Imp.' : 'Normal'}
      </div>
    </div>
  );
}
