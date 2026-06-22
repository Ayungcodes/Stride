const variants = {
  // Status
  active:      "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  inactive:    "bg-[#2a2a2a] text-[#666] border border-[#333]",
  completed:   "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
  on_hold:     "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  in_progress: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  todo:        "bg-[#2a2a2a] text-[#888] border border-[#333]",
  done:        "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  // Priority
  urgent:      "bg-red-500/10 text-red-400 border border-red-500/20",
  high:        "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  medium:      "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  low:         "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  overdue:     "bg-red-500/20 text-red-400 border border-red-500/30",
  none:        "bg-[#2a2a2a] text-[#666] border border-[#333]",
};

export default function Badge({ label, variant }) {
  const styles = variants[variant] ?? variants.none;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles}`}>
      {label}
    </span>
  );
}
