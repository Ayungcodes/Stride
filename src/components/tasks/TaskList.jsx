"use client";

import { useState } from "react";
import { CheckSquare } from "lucide-react";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { formatDate } from "@/lib/utils/formatters";

export default function TaskList({ tasks, onEdit, onDelete, deleting }) {
  const [confirmId, setConfirmId] = useState(null);

  function handleDeleteConfirm() {
    onDelete(confirmId);
    setConfirmId(null);
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={CheckSquare}
        title="No tasks yet"
        description="Add your first task to get started"
      />
    );
  }

  return (
    <>
      <div className="flex flex-col border border-[#2a2a2a] rounded-xl overflow-hidden">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className={`flex items-center justify-between px-5 py-4 hover:bg-[#1f1f1f] transition-colors
              ${index !== tasks.length - 1 ? "border-b border-[#2a2a2a]" : ""}`}
          >
            {/* Left — title + project + due date */}
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium text-[#e8e8e8]">{task.title}</p>
              <div className="flex items-center gap-2 text-xs text-[#555]">
                {task.projects?.name && (
                  <span>{task.projects.name}</span>
                )}
                {task.projects?.name && task.due_date && (
                  <span>·</span>
                )}
                {task.due_date && (
                  <span>Due {formatDate(task.due_date)}</span>
                )}
                {!task.projects?.name && !task.due_date && (
                  <span>Standalone task</span>
                )}
              </div>
            </div>

            {/* Right — status badge + actions */}
            <div
              className="flex items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Badge
                label={task.status.replace("_", " ")}
                variant={task.status}
              />
              <button
                onClick={() => onEdit(task)}
                className="text-xs text-[#555] hover:text-amber-400 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => setConfirmId(task.id)}
                className="text-xs text-[#555] hover:text-red-400 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!confirmId}
        title="Delete task?"
        description="This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmId(null)}
        loading={deleting}
      />
    </>
  );
}
