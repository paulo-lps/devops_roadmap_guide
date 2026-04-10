import { TrendingUp } from 'lucide-react';

interface OverallProgressProps {
  completed: number;
  total: number;
  percentage: number;
}

export function OverallProgress({ completed, total, percentage }: OverallProgressProps) {
  return (
    <div className="bg-white rounded-sm border-l-8 border-[#E20074] p-8 shadow-md relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 p-3 rounded-sm">
            <TrendingUp size={32} className="text-[#E20074]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#333333] uppercase tracking-tight">Progresso Geral</h2>
            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">DevOps & SRE Journey</p>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-6xl font-black text-[#E20074] tracking-tighter">{percentage}%</div>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Done</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 w-full bg-gray-100 rounded-full overflow-hidden mb-8">
        <div
          className="absolute top-0 left-0 h-full bg-[#E20074] transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
        <div className="border-t-2 border-gray-100 pt-4">
          <p className="text-3xl font-black text-[#E20074]">{completed}</p>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Concluído</p>
        </div>
        <div className="border-t-2 border-gray-100 pt-4">
          <p className="text-3xl font-black text-gray-400">{total - completed}</p>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Restante</p>
        </div>
        <div className="border-t-2 border-gray-100 pt-4">
          <p className="text-3xl font-black text-gray-800">{total}</p>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Total Topics</p>
        </div>
      </div>
    </div>
  );
}
