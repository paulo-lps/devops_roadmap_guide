import { TrendingUp } from 'lucide-react';

interface OverallProgressProps {
  completed: number;
  total: number;
  percentage: number;
}

export function OverallProgress({ completed, total, percentage }: OverallProgressProps) {
  return (
    <div className="bg-white rounded-xl border border-fuchsia-100 p-8 shadow-lg shadow-fuchsia-50 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-magenta-50 rounded-full blur-3xl opacity-50" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-magenta-100 p-3 rounded-xl">
            <TrendingUp size={32} className="text-magenta-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Progresso Geral</h2>
            <p className="text-gray-500 font-medium">Sua jornada DevOps</p>
          </div>
        </div>
        <div className="flex items-end gap-3">
          <div className="text-6xl font-black text-magenta-600 tracking-tighter">{percentage}%</div>
          <div className="mb-2 text-sm font-bold text-gray-400 uppercase tracking-widest">Concluído</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-4 w-full bg-fuchsia-50 rounded-full overflow-hidden mb-8 border border-fuchsia-100">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-magenta-500 via-fuchsia-500 to-magenta-600 rounded-full transition-all duration-1000 ease-out shadow-sm"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
        <div className="bg-fuchsia-50/50 rounded-xl p-4 border border-fuchsia-100/50 text-center">
          <p className="text-3xl font-black text-magenta-600">{completed}</p>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Concluído</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 text-center shadow-sm">
          <p className="text-3xl font-black text-gray-400">{total - completed}</p>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Restante</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 text-center shadow-sm">
          <p className="text-3xl font-black text-gray-800">{total}</p>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Total</p>
        </div>
      </div>
    </div>
  );
}
