"use client";

import { useState } from "react";
import { Plus, FolderKanban } from "lucide-react";
import { useProjects, useProjectMutations } from "@/lib/hooks/useProjects";
import ProjectList from "@/components/projects/ProjectList";
import ProjectGrid from "@/components/projects/ProjectGrid";
import ProjectForm from "@/components/projects/ProjectForm";
import SearchBar from "@/components/ui/SearchBar";
import ViewToggle from "@/components/ui/ViewToggle";
import Drawer from "@/components/ui/Drawer";
import StatCard from "@/components/ui/StatCard";

export default function ProjectsPage() {
  const { projects = [], loading, refetch } = useProjects();
  const { create, update, remove, mutating } = useProjectMutations();

  const [search, setSearch] = useState("");
  const [view, setView] = useState("list");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Stats calculations
  const total = projects.length;
  const active = projects.filter((p) => p.status === "active").length;
  const completed = projects.filter((p) => p.status === "completed").length;
  const onHold = projects.filter((p) => p.status === "on_hold").length;

  // Filter by search matching project name or nested client relation string data
  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.clients?.name?.toLowerCase().includes(search.toLowerCase())
  );

  function handleEdit(project) {
    setEditing(project);
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
      
      {/* Top Section Layout Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-100 tracking-tight">Projects</h1>
          <p className="text-sm text-stone-500 mt-1">Track and manage your active work</p>
        </div>
        
        {/* Unified Premium Active Scale Action Button */}
        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 px-4 h-10 bg-amber-500 hover:bg-amber-400 text-stone-950 text-sm font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-amber-500/10 flex-shrink-0"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Add Project</span>
        </button>
      </div>

      {/* Balanced 4-Column Metric Stat Layout */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Projects" value={loading ? "..." : total} variant="stone" />
        <StatCard label="Active" value={loading ? "..." : active} variant="active" />
        <StatCard label="Completed" value={loading ? "..." : completed} variant="completed" />
        <StatCard label="On Hold" value={loading ? "..." : onHold} variant="warning" />
      </div>

      {/* Structured Minimal Toolbar Wrapper */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full bg-stone-900/40 p-2 rounded-2xl border border-stone-900/60 backdrop-blur-sm">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search projects..." />
        </div>
        <div className="flex items-center justify-end gap-2">
          <ViewToggle view={view} onChange={setView} />
        </div>
      </div>

      {/* Responsive Rendering Target Viewport */}
      <div className="relative min-h-[200px]">
        {loading ? (
          <div className="flex items-center gap-3 text-sm text-stone-500 p-4 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            Loading project timelines...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-12 rounded-2xl border border-dashed border-stone-900 bg-stone-900/10 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <FolderKanban size={32} className="text-stone-600 mb-3" />
            <p className="text-sm font-medium text-stone-400">No matching projects located</p>
            <p className="text-xs text-stone-600 mt-1">Try tweaking your search filters or construct a new build map</p>
          </div>
        ) : (
          /* Smooth visual entry transformation when layout changes */
          <div key={view} className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
            {view === "list" ? (
              <ProjectList
                projects={filtered}
                onEdit={handleEdit}
                onDelete={handleDelete}
                deleting={mutating}
              />
            ) : (
              <ProjectGrid
                projects={filtered}
                onEdit={handleEdit}
                onDelete={handleDelete}
                deleting={mutating}
              />
            )}
          </div>
        )}
      </div>

      {/* Mount Interface Overlay Structure Sheet */}
      <Drawer
        open={drawerOpen}
        onClose={handleClose}
        title={editing ? "Edit project" : "Add project"}
      >
        <ProjectForm
          initial={editing}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          loading={mutating}
        />
      </Drawer>
    </div>
  );
}