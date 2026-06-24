import { AlertTriangle } from "lucide-react";

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center mb-4">
        <AlertTriangle size={20} className="text-red-400" strokeWidth={1.5} />
      </div>
      <h3 className="text-sm font-medium text-[#888] mb-1">Something went wrong</h3>
      {message && (
        <p className="text-xs text-[#555] mb-5 max-w-xs">{message}</p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-xs text-[#888] hover:text-[#e8e8e8] hover:border-[#3a3a3a] transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}