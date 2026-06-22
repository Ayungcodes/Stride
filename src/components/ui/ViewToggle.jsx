import { LayoutList, LayoutGrid } from "lucide-react";

export default function ViewToggle({ view, onChange }) {
  return (
    <div className="flex items-center bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-1 gap-1">
      <button
        onClick={() => onChange("list")}
        className={`p-1.5 rounded-md transition-colors ${
          view === "list"
            ? "bg-[#2a2a2a] text-[#e8e8e8]"
            : "text-[#555] hover:text-[#888]"
        }`}
        aria-label="List view"
      >
        <LayoutList size={16} />
      </button>
      <button
        onClick={() => onChange("grid")}
        className={`p-1.5 rounded-md transition-colors ${
          view === "grid"
            ? "bg-[#2a2a2a] text-[#e8e8e8]"
            : "text-[#555] hover:text-[#888]"
        }`}
        aria-label="Grid view"
      >
        <LayoutGrid size={16} />
      </button>
    </div>
  );
}
