export default function StatCard({ label, value, sub }) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 flex flex-col gap-3">
      <span className="text-sm text-[#888] font-medium">{label}</span>
      <span className="text-3xl font-semibold text-[#f0f0f0] tracking-tight">
        {value ?? "—"}
      </span>
      {sub && <span className="text-xs text-[#555]">{sub}</span>}
    </div>
  );
}
