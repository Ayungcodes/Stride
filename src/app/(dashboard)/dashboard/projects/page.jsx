"use client";

import { useState } from "react";
import {
  Plus,
  Folder,
  Activity,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useProjects, useProjectMutations } from "@/lib/hooks/useProjects";
import ProjectList from "@/components/projects/ProjectList";
import ProjectGrid from "@/components/projects/ProjectGrid";
import ProjectForm from "@/components/projects/ProjectForm";
import SearchBar from "@/components/ui/SearchBar";
import ViewToggle from "@/components/ui/ViewToggle";
import Drawer from "@/components/ui/Drawer";
import StatCard from "@/components/ui/StatCard";
import {
  StatCardsSkeleton,
  ListSkeleton,
  GridSkeleton,
} from "@/components/ui/Skeleton";
import ErrorState from "@/components/ui/ErrorState";

export default function ProjectsPage() {
  const { projects = [], loading, error, refetch } = useProjects();
  const { create, update, remove, mutating } = useProjectMutations();

  const [search, setSearch] = useState("");
  const [view, setView] = useState("list");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Compute metrics safely with optional chaining guards
  const total = projects?.length || 0;
  const active = projects?.filter((p) => p?.status === "active").length || 0;
  const completed =
    projects?.filter((p) => p?.status === "completed").length || 0;
  const onHold = projects?.filter((p) => p?.status === "on_hold").length || 0;

  // Structural dynamic matching query tracking
  const filtered =
    projects?.filter(
      (p) =>
        p?.name?.toLowerCase().includes(search.toLowerCase()) ||
        p?.clients?.name?.toLowerCase().includes(search.toLowerCase()),
    ) || [];

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
    if (editing) await update(editing.id, formData);
    else await create(formData);
    await refetch();
    handleClose();
  }

  async function handleDelete(id) {
    await remove(id);
    await refetch();
  }

  const toolbarBorderStyles =
    "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-stone-900/10 border border-stone-900/60 p-3 rounded-xl backdrop-blur-sm";
  const emptyContainerStyles =
    "w-full border border-stone-900 bg-stone-950/20 rounded-2xl p-16 flex flex-col items-center justify-center text-center gap-2 animate-in fade-in duration-200";

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-stone-900 pb-6">
        <h1 className="text-3xl font-semibold text-stone-100 tracking-tight">
          Projects
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Track and orchestrate active core deliverables and runtime tasks
        </p>
      </div>

      {loading ? (
        <StatCardsSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            label="Total Projects"
            value={total}
            icon={<Folder className="text-stone-500" size={15} />}
          />
          <StatCard
            label="Active Build"
            value={active}
            icon={<Activity className="text-amber-500/70" size={15} />}
          />
          <StatCard
            label="Completed"
            value={completed}
            icon={<CheckCircle2 className="text-emerald-500/70" size={15} />}
          />
          <StatCard
            label="On Hold"
            value={onHold}
            icon={<AlertTriangle className="text-stone-600" size={15} />}
          />
        </div>
      )}

      <div className="flex items-center gap-3 bg-stone-900/10 border border-stone-900/60 p-3 rounded-xl backdrop-blur-sm w-full">
        <div className="flex-1 min-w-0">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search projects..."
          />
        </div>
        <ViewToggle view={view} onChange={setView} />

        <button
          onClick={handleAdd}
          className="h-10 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] shadow-lg shadow-amber-500/5 flex-shrink-0"
        >
          <Plus size={15} strokeWidth={2.5} />
          <span className="hidden sm:inline">Add Project</span>
        </button>
      </div>

      <div className="w-full animate-in fade-in slide-in-from-top-2 duration-200">
        {loading ? (
          view === "list" ? (
            <ListSkeleton rows={5} />
          ) : (
            <GridSkeleton cards={6} />
          )
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : filtered.length === 0 ? (
          <div className={emptyContainerStyles}>
            <Folder size={24} className="text-stone-700 mb-2" />
            <p className="text-sm font-medium text-stone-300">
              No project blueprints isolated
            </p>
            <p className="text-xs text-stone-600 max-w-xs">
              Your search parameters evaluated to an empty sequence map.
            </p>
          </div>
        ) : view === "list" ? (
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

      <Drawer
        open={drawerOpen}
        onClose={handleClose}
        title={editing ? "Update project metadata" : "Initialize project node"}
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
