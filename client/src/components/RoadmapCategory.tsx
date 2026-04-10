import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { RoadmapCategory as RoadmapCategoryType, RoadmapItem as RoadmapItemType } from '@/hooks/useRoadmapProgress';
import { RoadmapItem } from './RoadmapItem';

interface RoadmapCategoryProps {
  category: RoadmapCategoryType;
  progress: { completed: number; total: number; percentage: number };
  onToggleItem: (categoryId: number, itemPath: string[]) => void;
}

export function RoadmapCategoryComponent({ category, progress, onToggleItem }: RoadmapCategoryProps) {
  const [expanded, setExpanded] = useState(true);

  const renderItems = (items: RoadmapItemType[] | undefined, path: string[] = []) => {
    if (!items) return null;

    return items.map((item) => (
      <RoadmapItem
        key={item.name}
        item={item}
        categoryId={category.id}
        onToggle={() => onToggleItem(category.id, [...path, item.name])}
      />
    ));
  };

  const renderSubcategories = () => {
    if (!category.subcategories) return null;

    return category.subcategories.map((sub) => (
      <div key={sub.name} className="space-y-2">
        <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide px-1">
          {sub.name}
        </h4>
        <div className="space-y-2 pl-2 border-l-2 border-gray-200">
          {renderItems(sub.items, [sub.name])}
          {sub.subcategories && renderSubcategoriesNested(sub.subcategories)}
        </div>
      </div>
    ));
  };

  const renderSubcategoriesNested = (subcategories: any[]) => {
    return (
      <>
        {subcategories.map((sub) => (
          <div key={sub.name} className="space-y-2">
            <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">
              {sub.name}
            </h5>
            <div className="space-y-2 pl-2 border-l-2 border-gray-100">
              {renderItems(sub.items, [sub.name])}
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150"
      >
        <div className="flex items-center gap-3 flex-1 text-left">
          {expanded ? (
            <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />
          ) : (
            <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
          )}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {category.category}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {progress.completed} de {progress.total} concluído
            </p>
          </div>
        </div>

        {/* Progress Badge */}
        <div className="flex-shrink-0 text-right">
          <div className="text-2xl font-bold text-blue-600">
            {progress.percentage}%
          </div>
        </div>
      </button>

      {/* Progress Bar */}
      <div className="px-6 pb-4">
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>

      {/* Content */}
      {expanded && (
        <div className="px-6 pb-4 space-y-4 border-t border-gray-100">
          {category.items && renderItems(category.items)}
          {category.subcategories && renderSubcategories()}
        </div>
      )}
    </div>
  );
}
