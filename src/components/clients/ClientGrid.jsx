"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Mail, Phone, MapPin } from "lucide-react";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { getInitials, getClientStatus } from "@/lib/utils/formatters";

export default function ClientGrid({ clients, onEdit, onDelete, deleting }) {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((client) => {
          const status = getClientStatus(client.projects);
          return (
            <div
              key={client.id}
              onClick={() => router.push(`/dashboard/clients/${client.id}`)}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 cursor-pointer hover:border-[#3a3a3a] transition-colors flex flex-col gap-4"
            >
              {/* Top — avatar + badge */}
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-sm font-semibold text-indigo-400">
                  {getInitials(client.name)}
                </div>
                <Badge
                  label={status === "active" ? "Active" : "Inactive"}
                  variant={status}
                />
              </div>

              {/* Name */}
              <div>
                <p className="text-sm font-semibold text-[#e8e8e8]">{client.name}</p>
                {client.notes && (
                  <p className="text-xs text-[#555] mt-0.5 line-clamp-2">{client.notes}</p>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-col gap-1.5">
                {client.email && (
                  <div className="flex items-center gap-2 text-xs text-[#555]">
                    <Mail size={12} />
                    <span className="truncate">{client.email}</span>
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center gap-2 text-xs text-[#555]">
                    <Phone size={12} />
                    <span>{client.phone}</span>
                  </div>
                )}
                {client.address && (
                  <div className="flex items-center gap-2 text-xs text-[#555]">
                    <MapPin size={12} />
                    <span className="truncate">{client.address}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div
                className="flex gap-4 pt-2 border-t border-[#2a2a2a]"
                onClick={(e) => e.stopPropagation()}
              >
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
