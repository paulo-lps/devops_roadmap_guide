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
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Important':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Normal':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className={cn(
      "group border rounded-lg transition-all duration-200 mb-2 overflow-hidden",
      item.completed ? "bg-magenta-50/30 border-magenta-100" : "bg-white border-gray-200 hover:border-magenta-200 shadow-sm"
    )}>
      <div className="flex items-center p-3 gap-3">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          className={cn(
            "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200",
            item.completed 
              ? "bg-magenta-600 border-magenta-600 text-white" 
              : "border-gray-300 hover:border-magenta-400 bg-white"
          )}
        >
          {item.completed && <Check size={16} className={isAnimating ? "animate-checkmark" : ""} />}
        </button>

        {/* Name */}
        <span className={cn(
          "flex-1 font-medium transition-all duration-200",
          item.completed ? "text-gray-400 line-through" : "text-gray-700"
        )}>
          {item.name}
        </span>

        {/* Importance Badge / Selector */}
        <select
          value={item.importance}
          onChange={(e) => onUpdateImportance(e.target.value as ImportanceLevel)}
          className={cn(
            "text-[10px] uppercase font-bold px-2 py-1 rounded border transition-colors cursor-pointer outline-none",
            getImportanceColor(item.importance)
          )}
        >
          <option value="Very Important">Muito Imp.</option>
          <option value="Important">Imp.</option>
          <option value="Normal">Normal</option>
        </select>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              isExpanded ? "bg-magenta-100 text-magenta-600" : "text-gray-400 hover:bg-gray-100 hover:text-magenta-600"
            )}
            title="Comentários"
          >
            <MessageSquare size={16} />
          </button>
          <button
            onClick={onRemove}
            className="p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
            title="Remover"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Expand Toggle (Mobile/Always visible) */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 text-gray-400 hover:text-magenta-600 md:hidden"
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* Expanded Content (Notes) */}
      {isExpanded && (
        <div className="px-3 pb-3 pt-1 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <AlertCircle size={12} />
            <span>Notas e Comentários</span>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => onUpdateNotes(notes)}
            placeholder="Adicione links, comandos ou observações aqui..."
            className="w-full min-h-[80px] p-2 text-sm bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-magenta-500/20 focus:border-magenta-500 outline-none transition-all resize-y"
          />
          <div className="mt-2 flex justify-end">
            <span className="text-[10px] text-gray-400 italic">Salvo automaticamente ao sair do campo</span>
          </div>
        </div>
      )}
    </div>
  );
}
