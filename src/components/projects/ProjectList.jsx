"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderKanban } from "lucide-react";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { formatDate, getPriority, priorityStyles } from "@/lib/utils/formatters";

export default function ProjectList({ projects, onEdit, onDelete, deleting }) {
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
      <div className="flex flex-col border border-[#2a2a2a] rounded-xl overflow-hidden">
        {projects.map((project, index) => {
          const priority = getPriority(project.due_date);
          return (
            <div
              key={project.id}
              onClick={() => router.push(`/dashboard/projects/${project.id}`)}
              className={`flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#1f1f1f] transition-colors
                ${index !== projects.length - 1 ? "border-b border-[#2a2a2a]" : ""}`}
            >
              {/* Left — name + client + due date */}
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium text-[#e8e8e8]">{project.name}</p>
                <div className="flex items-center gap-2 text-xs text-[#555]">
                  {project.clients?.name && (
                    <span>{project.clients.name}</span>
                  )}
                  {project.clients?.name && project.due_date && (
                    <span>·</span>
                  )}
                  {project.due_date && (
                    <span>Due {formatDate(project.due_date)}</span>
                  )}
                </div>
              </div>

              {/* Right — priority + status + actions */}
              <div
                className="flex items-center gap-3"
                onClick={(e) => e.stopPropagation()}
              >
                {priority !== "none" && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityStyles[priority]}`}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </span>
                )}
                <Badge label={project.status.replace("_", " ")} variant={project.status} />
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
