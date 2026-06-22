"use client";

import { useState } from "react";
import { Plus, CheckSquare } from "lucide-react";
import { useTasks, useTaskMutations } from "@/lib/hooks/useTasks";
import TaskList from "@/components/tasks/TaskList";
import TaskForm from "@/components/tasks/TaskForm";
import SearchBar from "@/components/ui/SearchBar";
import Drawer from "@/components/ui/Drawer";
import StatCard from "@/components/ui/StatCard";

export default function TasksPage() {
  const { tasks = [], loading, refetch } = useTasks();
  const { create, update, remove, mutating } = useTaskMutations();

  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Stats
  const total = tasks.length;
  const active = tasks.filter((t) => t.status === "in_progress").length;
  const completed = tasks.filter((t) => t.status === "done").length;
  const overdue = tasks.filter((t) => {
    if (!t.due_date || t.status === "done") return false;
    return new Date(t.due_date) < new Date();
  }).length;

  // Filter by search
  const filtered = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.projects?.name?.toLowerCase().includes(search.toLowerCase())
  );

  function handleEdit(task) {
    setEditing(task);
    setDrawerOpen(true);
  }

  function handleAdd() {
    setEditing(null);
    setDrawerOpen(true);
  }

  function handleClose() {
    setDrawerOpen(false);
    setEditing(null);
  }

  async function handleSubmit(formData) {
    if (editing) {
      await update(editing.id, formData);
    } else {
      await create(formData);
    }
    await refetch();
    handleClose();
  }

  async function handleDelete(id) {
    await remove(id);
    await refetch();
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-100 tracking-tight">Tasks</h1>
          <p className="text-sm text-stone-500 mt-1">Manage your to-dos across all projects</p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 px-4 h-10 bg-amber-500 hover:bg-amber-400 text-stone-950 text-sm font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-amber-500/10 flex-shrink-0"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Add Task</span>
        </button>
      </div>

      {/* Stats card */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Tasks" value={loading ? "..." : total} variant="stone" />
        <StatCard label="In Progress" value={loading ? "..." : active} variant="active" />
        <StatCard label="Completed" value={loading ? "..." : completed} variant="completed" />
        <StatCard label="Overdue" value={loading ? "..." : overdue} variant="danger" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full bg-stone-900/40 p-2 rounded-2xl border border-stone-900/60 backdrop-blur-sm">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search tasks..." />
        </div>
      </div>

      {/* Task List */}
      <div className="relative min-h-[200px]">
        {loading ? (
          <div className="flex items-center gap-3 text-sm text-stone-500 p-4 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            Loading system tasks...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-12 rounded-2xl border border-dashed border-stone-900 bg-stone-900/10 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <CheckSquare size={32} className="text-stone-600 mb-3" />
            <p className="text-sm font-medium text-stone-400">No tasks found</p>
            <p className="text-xs text-stone-600 mt-1">Everything is clear or matches no current filter parameters</p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
            <TaskList
              tasks={filtered}
              onEdit={handleEdit}
              onDelete={handleDelete}
              deleting={mutating}
            />
          </div>
        )}
      </div>

      {/* Task Form Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={handleClose}
        title={editing ? "Edit task" : "Add task"}
      >
        <TaskForm
          initial={editing}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          loading={mutating}
        />
      </Drawer>
    </div>
  );
}