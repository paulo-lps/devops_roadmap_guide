import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { RoadmapCategory as RoadmapCategoryType, RoadmapItem as RoadmapItemType, ImportanceLevel } from '@/hooks/useRoadmapProgress';
import { RoadmapItem } from './RoadmapItem';

interface RoadmapCategoryProps {
  category: RoadmapCategoryType;
  progress: { completed: number; total: number; percentage: number };
  onToggleItem: (categoryId: number, itemPath: string[]) => void;
  onUpdateNotes: (categoryId: number, itemPath: string[], notes: string) => void;
  onUpdateImportance: (categoryId: number, itemPath: string[], importance: ImportanceLevel) => void;
  onAddItem: (categoryId: number, parentPath: string[], newItem: RoadmapItemType) => void;
  onRemoveItem: (categoryId: number, itemPath: string[]) => void;
}

export function RoadmapCategoryComponent({ 
  category, 
  progress, 
  onToggleItem,
  onUpdateNotes,
  onUpdateImportance,
  onAddItem,
  onRemoveItem
}: RoadmapCategoryProps) {
  const [expanded, setExpanded] = useState(true);
  const [showAddForm, setShowAddForm] = useState<{path: string[] | null}>({path: null});
  const [newItemName, setNewItemName] = useState('');
  const [newItemImportance, setNewItemImportance] = useState<ImportanceLevel>('Normal');

  const handleAddItem = (path: string[]) => {
    if (!newItemName.trim()) return;
    
    onAddItem(category.id, path, {
      name: newItemName.trim(),
      importance: newItemImportance,
      completed: false
    });
    
    setNewItemName('');
    setShowAddForm({path: null});
  };

  const renderAddForm = (path: string[]) => (
    <div className="mt-2 p-3 border border-dashed border-magenta-300 rounded-lg bg-magenta-50/50">
      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Nome da nova skill..."
          className="w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-magenta-500/20 focus:border-magenta-500 outline-none"
          onKeyDown={(e) => e.key === 'Enter' && handleAddItem(path)}
          autoFocus
        />
        <div className="flex items-center justify-between">
          <select
            value={newItemImportance}
            onChange={(e) => setNewItemImportance(e.target.value as ImportanceLevel)}
            className="text-xs p-1.5 border border-gray-200 rounded-md outline-none"
          >
            <option value="Very Important">Muito Importante</option>
            <option value="Important">Importante</option>
            <option value="Normal">Normal</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddForm({path: null})}
              className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>
            <button
              onClick={() => handleAddItem(path)}
              className="px-3 py-1.5 text-xs bg-magenta-600 text-white rounded-md hover:bg-magenta-700 transition-colors"
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderItems = (items: RoadmapItemType[] | undefined, path: string[] = []) => {
    const itemsList = items || [];
    
    return (
      <div className="mb-4 space-y-2">
        {itemsList.map((item) => (
          <RoadmapItem
            key={item.name}
            item={item}
            onToggle={() => onToggleItem(category.id, [...path, item.name])}
            onUpdateNotes={(notes) => onUpdateNotes(category.id, [...path, item.name], notes)}
            onUpdateImportance={(imp) => onUpdateImportance(category.id, [...path, item.name], imp)}
            onRemove={() => onRemoveItem(category.id, [...path, item.name])}
          />
        ))}
        {showAddForm.path?.join(',') === path.join(',') ? (
          renderAddForm(path)
        ) : (
          <button
            onClick={() => setShowAddForm({path})}
            className="flex items-center gap-2 text-xs text-magenta-600 hover:text-magenta-700 font-medium p-2 mt-1"
          >
            <Plus size={14} /> Adicionar skill
          </button>
        )}
      </div>
    );
  };

  const renderSubcategories = (subcategories: any[] | undefined, path: string[] = []) => {
    if (!subcategories) return null;

    return subcategories.map((sub) => (
      <div key={sub.name} className="ml-4 mt-4">
        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-magenta-400"></span>
          {sub.name}
        </h4>
        {renderItems(sub.items, [...path, sub.name])}
        {sub.subcategories && renderSubcategories(sub.subcategories, [...path, sub.name])}
      </div>
    ));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Category Header */}
      <div 
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-lg font-bold text-gray-900">{category.category}</h3>
            <span className="px-2 py-0.5 bg-magenta-100 text-magenta-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
              {progress.percentage}%
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{progress.completed} de {progress.total} tópicos concluídos</span>
          </div>
        </div>
        <div className="text-gray-400">
          {expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-gray-100">
        <div 
          className="h-full bg-gradient-to-r from-magenta-500 to-fuchsia-500 transition-all duration-500 ease-out"
          style={{ width: `${progress.percentage}%` }}
        />
      </div>

      {/* Category Content */}
      {expanded && (
        <div className="p-5 bg-gray-50/30">
          {renderItems(category.items)}
          {renderSubcategories(category.subcategories)}
        </div>
      )}
    </div>
  );
}
