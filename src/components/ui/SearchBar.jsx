import { Search } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <div className="relative flex-1">
      <Search
        size={15}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg pl-9 pr-4 py-2.5 text-sm text-[#e8e8e8] placeholder:text-[#555] focus:outline-none focus:border-indigo-500/50 transition-colors"
      />
    </div>
  );
}
