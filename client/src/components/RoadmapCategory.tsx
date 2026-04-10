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
    <div className="mt-3 p-4 border-2 border-dashed border-gray-200 rounded-sm bg-white">
      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Nome da nova skill..."
          className="w-full p-3 text-xs font-bold uppercase tracking-widest border border-gray-200 rounded-sm focus:ring-2 focus:ring-[#E20074]/20 focus:border-[#E20074] outline-none"
          onKeyDown={(e) => e.key === 'Enter' && handleAddItem(path)}
          autoFocus
        />
        <div className="flex items-center justify-between">
          <select
            value={newItemImportance}
            onChange={(e) => setNewItemImportance(e.target.value as ImportanceLevel)}
            className="text-[10px] font-black uppercase tracking-widest p-2 border border-gray-200 rounded-sm outline-none"
          >
            <option value="Very Important">Muito Importante</option>
            <option value="Important">Importante</option>
            <option value="Normal">Normal</option>
          </select>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddForm({path: null})}
              className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>
            <button
              onClick={() => handleAddItem(path)}
              className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-[#E20074] text-white rounded-sm hover:bg-[#c00062] transition-colors"
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
      <div className="mb-6 space-y-1">
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
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#E20074] hover:text-[#c00062] p-3 mt-2 border border-dashed border-gray-200 w-full justify-center hover:bg-gray-50 transition-colors"
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
      <div key={sub.name} className="ml-6 mt-6 border-l-2 border-gray-100 pl-6">
        <h4 className="text-xs font-black text-[#333333] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-[#E20074]"></span>
          {sub.name}
        </h4>
        {renderItems(sub.items, [...path, sub.name])}
        {sub.subcategories && renderSubcategories(sub.subcategories, [...path, sub.name])}
      </div>
    ));
  };

  return (
    <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 mb-8">
      {/* Category Header */}
      <div 
        className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <h3 className="text-xl font-black text-[#333333] uppercase tracking-tighter">{category.category}</h3>
            <span className="px-3 py-1 bg-[#E20074] text-white text-[10px] font-black rounded-sm uppercase tracking-widest">
              {progress.percentage}%
            </span>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span>{progress.completed} / {progress.total} Topics Completed</span>
          </div>
        </div>
        <div className="text-gray-300">
          {expanded ? <ChevronUp size={28} /> : <ChevronDown size={28} />}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 w-full bg-gray-50">
        <div 
          className="h-full bg-[#E20074] transition-all duration-700 ease-in-out"
          style={{ width: `${progress.percentage}%` }}
        />
      </div>

      {/* Category Content */}
      {expanded && (
        <div className="p-8 bg-white">
          {renderItems(category.items)}
          {renderSubcategories(category.subcategories)}
        </div>
      )}
    </div>
  );
}
