"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Mail, Phone, MapPin } from "lucide-react";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { getInitials } from "@/lib/utils/formatters";

export default function ClientGrid({
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((client) => {
          const isActive = client.status
            ? String(client.status).trim().toLowerCase() === "active"
            : false;

          return (
            <div
              key={client.id}
              onClick={() => router.push(`/dashboard/clients/${client.id}`)}
              className="bg-stone-900/30 border border-stone-900/80 rounded-xl p-5 cursor-pointer hover:border-stone-800 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40 transition-all duration-300 flex flex-col gap-4 group"
            >
              {/* Client avatar and status */}
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-stone-900/60 border border-stone-800/80 flex items-center justify-center text-sm font-bold text-stone-200 transition-colors group-hover:border-amber-500/20 group-hover:text-amber-500">
                  {getInitials(client.name)}
                </div>
                <Badge
                  label={isActive ? "Active" : "Inactive"}
                  variant={isActive ? "active" : "inactive"}
                />
              </div>

              {/* Client ID header */}
              <div>
                <p className="text-sm font-semibold text-stone-200 group-hover:text-amber-500 transition-colors duration-200">
                  {client.name}
                </p>
                {client.notes && (
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {client.notes}
                  </p>
                )}
              </div>

              {/* Contact info */}
              <div className="flex flex-col gap-2 mt-auto">
                {client.email && (
                  <div className="flex items-center gap-2.5 text-xs text-stone-400">
                    <Mail size={13} className="text-stone-600 flex-shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center gap-2.5 text-xs text-stone-400">
                    <Phone size={13} className="text-stone-600 flex-shrink-0" />
                    <span>{client.phone}</span>
                  </div>
                )}
                {client.address && (
                  <div className="flex items-center gap-2.5 text-xs text-stone-400">
                    <MapPin
                      size={13}
                      className="text-stone-600 flex-shrink-0"
                    />
                    <span className="truncate">{client.address}</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div
                className="flex gap-2 pt-3 border-t border-stone-900/80 mt-1"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onEdit(client)}
                  className="flex-1 py-1.5 rounded-lg border border-stone-900 bg-stone-950/40 text-xs font-medium text-stone-400 hover:text-stone-200 hover:bg-stone-900/40 transition-all duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => setConfirmId(client.id)}
                  className="flex-1 py-1.5 rounded-lg border border-transparent text-xs font-medium text-stone-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
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
