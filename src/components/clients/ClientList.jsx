"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { getInitials, getClientStatus } from "@/lib/utils/formatters";

export default function ClientList({ clients, onEdit, onDelete, deleting }) {
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
      <div className="flex flex-col border border-[#2a2a2a] rounded-xl overflow-hidden">
        {clients.map((client, index) => {
          const status = getClientStatus(client.projects);
          return (
            <div
              key={client.id}
              onClick={() => router.push(`/dashboard/clients/${client.id}`)}
              className={`flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#1f1f1f] transition-colors
                ${index !== clients.length - 1 ? "border-b border-[#2a2a2a]" : ""}`}
            >
              {/* Left — avatar + info */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs font-semibold text-indigo-400 flex-shrink-0">
                  {getInitials(client.name)}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#e8e8e8]">{client.name}</p>
                  <p className="text-xs text-[#555]">{client.email || "No email"}</p>
                </div>
              </div>

              {/* Right — badge + actions */}
              <div
                className="flex items-center gap-4"
                onClick={(e) => e.stopPropagation()}
              >
                <Badge
                  label={status === "active" ? "Active" : "Inactive"}
                  variant={status}
                />
                <button
                  onClick={() => onEdit(client)}
                  className="text-xs text-[#555] hover:text-indigo-400 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setConfirmId(client.id)}
                  className="text-xs text-[#555] hover:text-red-400 transition-colors"
                >
                  Delete
                </button>
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
