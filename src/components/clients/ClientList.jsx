"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Edit2, Trash2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { getInitials } from "@/lib/utils/formatters";

export default function ClientList({
  clients = [],
  onEdit,
  onDelete,
  deleting,
}) {
  const router = useRouter();
  const [confirmId, setConfirmId] = useState(null);

  function handleDeleteConfirm() {
    onDelete(confirmId);
    setConfirmId(null);
  }

  if (clients.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No clients yet"
        description="Add your first client to get started"
      />
    );
  }

  return (
    <>
      <div className="flex flex-col bg-stone-900/10 border border-stone-900/80 rounded-xl overflow-hidden backdrop-blur-sm">
        {clients.map((client, index) => {
          const isActive = client.status
            ? String(client.status).trim().toLowerCase() === "active"
            : false;

          return (
            <div
              key={client.id}
              onClick={() => router.push(`/dashboard/clients/${client.id}`)}
              className={`flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-stone-900/40 transition-colors group
                ${index !== clients.length - 1 ? "border-b border-stone-900/60" : ""}`}
            >
              {/* Client info */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-stone-900 border border-stone-800/80 flex items-center justify-center text-xs font-bold text-stone-300 transition-colors group-hover:border-amber-500/20 group-hover:text-amber-500 flex-shrink-0">
                  {getInitials(client.name)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-stone-200 group-hover:text-amber-500 transition-colors duration-200 truncate">
                    {client.name}
                  </p>
                  <p className="text-xs text-stone-500 truncate mt-0.5">
                    {client.email || "No email address linked"}
                  </p>
                </div>
              </div>

              {/* Status and actions */}
              <div
                className="flex items-center gap-6 flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-20 flex justify-end">
                  <Badge
                    label={isActive ? "Active" : "Inactive"}
                    variant={isActive ? "active" : "inactive"}
                  />
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(client)}
                    className="p-1.5 rounded-md border border-stone-900/40 bg-stone-950/20 text-stone-500 hover:text-stone-200 hover:bg-stone-900/60 transition-all duration-200"
                    title="Edit client"
                  >
                    <span className="text-xs font-medium px-1 sm:inline hidden">
                      Edit
                    </span>
                    <Edit2 size={12} className="sm:hidden block" />
                  </button>
                  <button
                    onClick={() => setConfirmId(client.id)}
                    className="p-1.5 rounded-md text-stone-600 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
                    title="Delete client"
                  >
                    <span className="text-xs font-medium px-1 sm:inline hidden">
                      Delete
                    </span>
                    <Trash2 size={12} className="sm:hidden block" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        open={!!confirmId}
        title="Delete client?"
        description="This will remove the client. Their projects will not be deleted."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmId(null)}
        loading={deleting}
      />
    </>
  );
}