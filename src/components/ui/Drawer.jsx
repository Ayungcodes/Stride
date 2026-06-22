"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

export default function Drawer({ open, onClose, title, children }) {
  // Close on escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer panel — slides in from the right */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#141414] border-l border-[#2a2a2a] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2a2a2a]">
          <h2 className="text-base font-semibold text-[#f0f0f0]">{title}</h2>
          <button
            onClick={onClose}
            className="text-[#555] hover:text-[#888] transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
      </div>
    </div>
  );
}
