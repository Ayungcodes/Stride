"use client";

import { X } from "lucide-react";

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  description,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 w-full max-w-sm shadow-xl">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-[#555] hover:text-[#888] transition-colors"
        >
          <X size={16} />
        </button>

        <h3 className="text-base font-semibold text-[#f0f0f0] mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-[#666] mb-6">{description}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg border border-[#2a2a2a] text-sm text-[#888] hover:text-[#e8e8e8] hover:border-[#3a3a3a] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 hover:bg-red-500/20 disabled:opacity-50 transition-colors"
          >
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
