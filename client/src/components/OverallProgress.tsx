import { TrendingUp } from 'lucide-react';

interface OverallProgressProps {
  completed: number;
  total: number;
  percentage: number;
}

export function OverallProgress({ completed, total, percentage }: OverallProgressProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={24} className="text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Progresso Geral</h2>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-blue-600">{percentage}%</div>
          <p className="text-sm text-gray-600 mt-1">{completed} de {total} tópicos</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{completed}</p>
          <p className="text-xs text-gray-600 mt-1">Concluído</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{total - completed}</p>
          <p className="text-xs text-gray-600 mt-1">Restante</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-600">{total}</p>
          <p className="text-xs text-gray-600 mt-1">Total</p>
        </div>
      </div>
    </div>
  );
}
