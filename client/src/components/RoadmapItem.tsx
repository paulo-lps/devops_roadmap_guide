import { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Trash2, MessageSquare, AlertCircle } from 'lucide-react';
import { RoadmapItem as RoadmapItemType, ImportanceLevel } from '@/hooks/useRoadmapProgress';
import { cn } from '@/lib/utils';

interface RoadmapItemProps {
  item: RoadmapItemType;
  onToggle: () => void;
  onUpdateNotes: (notes: string) => void;
  onUpdateImportance: (importance: ImportanceLevel) => void;
  onRemove: () => void;
}

export function RoadmapItem({ 
  item, 
  onToggle, 
  onUpdateNotes, 
  onUpdateImportance, 
  onRemove 
}: RoadmapItemProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [notes, setNotes] = useState(item.notes || '');

  const handleToggle = () => {
    if (!item.completed) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }
    onToggle();
  };

  const getImportanceColor = (importance: ImportanceLevel) => {
    switch (importance) {
      case 'Very Important':
        return 'bg-[#E20074] text-white border-[#E20074]';
      case 'Important':
        return 'bg-[#666666] text-white border-[#666666]';
      case 'Normal':
        return 'bg-[#999999] text-white border-[#999999]';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className={cn(
      "group border-l-4 transition-all duration-200 mb-3 overflow-hidden shadow-sm",
      item.completed ? "bg-gray-50 border-[#E20074]" : "bg-white border-gray-200 hover:border-[#E20074]"
    )}>
      <div className="flex items-center p-4 gap-4">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          className={cn(
            "w-6 h-6 rounded-sm border-2 flex items-center justify-center transition-all duration-200",
            item.completed 
              ? "bg-[#E20074] border-[#E20074] text-white" 
              : "border-gray-300 hover:border-[#E20074] bg-white"
          )}
        >
          {item.completed && <Check size={16} className={isAnimating ? "animate-checkmark" : ""} />}
        </button>

        {/* Name */}
        <span className={cn(
          "flex-1 font-bold text-sm uppercase tracking-tight transition-all duration-200",
          item.completed ? "text-gray-400 line-through" : "text-[#333333]"
        )}>
          {item.name}
        </span>

        {/* Importance Badge / Selector */}
        <select
          value={item.importance}
          onChange={(e) => onUpdateImportance(e.target.value as ImportanceLevel)}
          className={cn(
            "text-[9px] uppercase font-black px-2 py-1 rounded-sm border transition-colors cursor-pointer outline-none tracking-widest",
            getImportanceColor(item.importance)
          )}
        >
          <option value="Very Important">Very Imp.</option>
          <option value="Important">Imp.</option>
          <option value="Normal">Normal</option>
        </select>

        {/* Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "p-2 rounded-sm transition-colors",
              isExpanded ? "bg-[#E20074] text-white" : "text-gray-400 hover:bg-gray-100 hover:text-[#E20074]"
            )}
            title="Comentários"
          >
            <MessageSquare size={14} />
          </button>
          <button
            onClick={onRemove}
            className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-sm transition-colors"
            title="Remover"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Expand Toggle (Mobile/Always visible) */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 text-gray-400 hover:text-[#E20074] md:hidden"
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* Expanded Content (Notes) */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2 mb-3 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
            <AlertCircle size={12} className="text-[#E20074]" />
            <span>Notas e Comentários</span>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => onUpdateNotes(notes)}
            placeholder="Adicione links, comandos ou observações aqui..."
            className="w-full min-h-[100px] p-3 text-xs font-medium bg-white border border-gray-200 rounded-sm focus:ring-2 focus:ring-[#E20074]/20 focus:border-[#E20074] outline-none transition-all resize-y text-[#333333]"
          />
          <div className="mt-2 flex justify-end">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest italic">Auto-saved</span>
          </div>
        </div>
      )}
    </div>
  );
}
