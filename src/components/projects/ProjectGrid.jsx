"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderKanban, Calendar, User } from "lucide-react";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { formatDate, getPriority, priorityStyles } from "@/lib/utils/formatters";

export default function ProjectGrid({ projects, onEdit, onDelete, deleting }) {
  const router = useRouter();
  const [confirmId, setConfirmId] = useState(null);

  function handleDeleteConfirm() {
    onDelete(confirmId);
    setConfirmId(null);
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="No projects yet"
        description="Add your first project to get started"
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => {
          const priority = getPriority(project.due_date);
          return (
            <div
              key={project.id}
              onClick={() => router.push(`/dashboard/projects/${project.id}`)}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 cursor-pointer hover:border-[#3a3a3a] transition-colors flex flex-col gap-4"
            >
              {/* Top — status + priority */}
              <div className="flex items-start justify-between gap-2">
                <Badge label={project.status.replace("_", " ")} variant={project.status} />
                {priority !== "none" && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityStyles[priority]}`}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </span>
                )}
              </div>

              {/* Name + details */}
              <div>
                <p className="text-sm font-semibold text-[#e8e8e8]">{project.name}</p>
                {project.details && (
                  <p className="text-xs text-[#555] mt-1 line-clamp-2">{project.details}</p>
                )}
              </div>

              {/* Meta */}
              <div className="flex flex-col gap-1.5">
                {project.clients?.name && (
                  <div className="flex items-center gap-2 text-xs text-[#555]">
                    <User size={12} />
                    <span>{project.clients.name}</span>
                  </div>
                )}
                {project.due_date && (
                  <div className="flex items-center gap-2 text-xs text-[#555]">
                    <Calendar size={12} />
                    <span>Due {formatDate(project.due_date)}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div
                className="flex gap-4 pt-2 border-t border-[#2a2a2a]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onEdit(project)}
                  className="text-xs text-[#555] hover:text-indigo-400 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setConfirmId(project.id)}
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
        title="Delete project?"
        description="This will remove the project. Tasks linked to it will not be deleted."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmId(null)}
        loading={deleting}
      />
    </>
  );
}
