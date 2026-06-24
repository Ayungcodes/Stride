"use client";

import { useState } from "react";
import { Plus, ListTodo, Play, CheckCircle2, Clock } from "lucide-react";
import { useTasks, useTaskMutations } from "@/lib/hooks/useTasks";
import TaskList from "@/components/tasks/TaskList";
import TaskForm from "@/components/tasks/TaskForm";
import SearchBar from "@/components/ui/SearchBar";
import Drawer from "@/components/ui/Drawer";
import StatCard from "@/components/ui/StatCard";
import { StatCardsSkeleton, ListSkeleton } from "@/components/ui/Skeleton";
import ErrorState from "@/components/ui/ErrorState";

export default function TasksPage() {
  const { tasks = [], loading, error, refetch } = useTasks();
  const { create, update, remove, mutating } = useTaskMutations();

  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Compute metrics safely with fallback handling
  const total = tasks?.length || 0;
  const active = tasks?.filter((t) => t?.status === "in_progress").length || 0;
  const completed = tasks?.filter((t) => t?.status === "done").length || 0;
  const overdue = tasks?.filter((t) => {
    if (!t?.due_date || t?.status === "done") return false;
    return new Date(t.due_date) < new Date();
  }).length || 0;

  // Filter matching lookup arrays
  const filtered = tasks?.filter((t) =>
    t?.title?.toLowerCase().includes(search.toLowerCase()) ||
    t?.projects?.name?.toLowerCase().includes(search.toLowerCase())
  ) || [];

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
    if (editing) await update(editing.id, formData);
    else await create(formData);
    await refetch();
    handleClose();
  }

  async function handleDelete(id) {
    await remove(id);
    await refetch();
  }

  const toolbarWrapperStyles = "flex items-center gap-3 bg-stone-900/10 border border-stone-900/60 p-3 rounded-xl backdrop-blur-sm";
  const emptyStateContainer = "w-full border border-stone-900 bg-stone-950/20 rounded-2xl p-16 flex flex-col items-center justify-center text-center gap-2 animate-in fade-in duration-200";

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 pb-16 animate-in fade-in duration-300">
      
      {/* Page Content Identity Module Header */}
      <div className="border-b border-stone-900 pb-6">
        <h1 className="text-3xl font-semibold text-stone-100 tracking-tight">Tasks</h1>
        <p className="text-sm text-stone-500 mt-1">
          Isolate and execute step-by-step runtime actions across open modules
        </p>
      </div>

      {/* Structural Metric Cards Row block */}
      {loading ? (
        <StatCardsSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard 
            label="Total Tasks" 
            value={total} 
            icon={<ListTodo className="text-stone-500" size={15} />} 
          />
          <StatCard 
            label="In Progress" 
            value={active} 
            icon={<Play className="text-amber-500/70" size={14} fill="currentColor" className="opacity-70" />} 
          />
          <StatCard 
            label="Completed" 
            value={completed} 
            icon={<CheckCircle2 className="text-emerald-500/70" size={15} />} 
          />
          <StatCard 
            label="Overdue Alert" 
            value={overdue} 
            icon={<Clock className={overdue > 0 ? "text-red-400" : "text-stone-600"} size={15} />} 
          />
        </div>
      )}

      {/* Operations Controls Interface Row Toolbar */}
      <div className={toolbarWrapperStyles}>
        <div className="flex-1">
          <SearchBar 
            value={search} 
            onChange={setSearch} 
            placeholder="Search tasks or associated project layers..." 
          />
        </div>
        
        <button
          onClick={handleAdd}
          className="h-10 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] shadow-lg shadow-amber-500/5 flex-shrink-0"
        >
          <Plus size={15} strokeWidth={2.5} />
          <span>Add Task</span>
        </button>
      </div>

      {/* Primary Data Render Zone Layout */}
      <div className="w-full animate-in fade-in slide-in-from-top-2 duration-200">
        {loading ? (
          <ListSkeleton rows={5} />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : filtered.length === 0 ? (
          <div className={emptyStateContainer}>
            <ListTodo size={24} className="text-stone-700 mb-2" />
            <p className="text-sm font-medium text-stone-300">No atomic items scheduled</p>
            <p className="text-xs text-stone-600 max-w-xs">Your current tracking indices display no incomplete instances matching this target.</p>
          </div>
        ) : (
          <TaskList 
            tasks={filtered} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
            deleting={mutating} 
          />
        )}
      </div>

      {/* Side-Drawer Modal Intercept Portal */}
      <Drawer 
        open={drawerOpen} 
        onClose={handleClose} 
        title={editing ? "Modify element properties" : "Schedule sub-task node"}
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