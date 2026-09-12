import React from 'react';
import { AlertTriangle, Flame } from 'lucide-react';

interface ReportButtonProps {
  onClick: () => void;
}

export default function ReportButton({ onClick }: ReportButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 z-40 group">
      {/* Outer pulsing shockwave rings */}
      <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-red-600 to-amber-600 opacity-75 blur-md group-hover:opacity-100 group-hover:duration-200 animate-pulse-slow"></span>
      <span className="absolute -inset-2 rounded-full bg-red-500/30 animate-ping opacity-60"></span>

      {/* Button */}
      <button
        onClick={onClick}
        className="relative flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-red-600 via-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold rounded-full shadow-2xl shadow-red-600/50 border border-red-400/40 hover:scale-105 active:scale-95 transition-all duration-200"
        title="Report Active Wildfire or Request SOS"
      >
        <div className="relative">
          <Flame className="h-5 w-5 text-amber-200" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping"></span>
        </div>
        <span className="text-sm tracking-wide uppercase font-extrabold text-white drop-shadow">
          Report Wildfire / SOS
        </span>
      </button>
    </div>
  );
}
