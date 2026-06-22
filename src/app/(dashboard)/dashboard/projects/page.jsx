"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useProjects, useProjectMutations } from "@/lib/hooks/useProjects";
import ProjectList from "@/components/projects/ProjectList";
import ProjectGrid from "@/components/projects/ProjectGrid";
import ProjectForm from "@/components/projects/ProjectForm";
import SearchBar from "@/components/ui/SearchBar";
import ViewToggle from "@/components/ui/ViewToggle";
import Drawer from "@/components/ui/Drawer";
import StatCard from "@/components/ui/StatCard";

export default function ProjectsPage() {
  const { projects, loading, refetch } = useProjects();
  const { create, update, remove, mutating } = useProjectMutations();

  const [search, setSearch] = useState("");
  const [view, setView] = useState("list");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Stats
  const total = projects.length;
  const active = projects.filter((p) => p.status === "active").length;
  const completed = projects.filter((p) => p.status === "completed").length;
  const onHold = projects.filter((p) => p.status === "on_hold").length;

  // Filter by search
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
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#f0f0f0] tracking-tight">Projects</h1>
        <p className="text-sm text-[#555] mt-1">Track and manage your active work</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Projects" value={loading ? "..." : total} />
        <StatCard label="Active" value={loading ? "..." : active} />
        <StatCard label="Completed" value={loading ? "..." : completed} />
        <StatCard label="On Hold" value={loading ? "..." : onHold} />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search projects..." />
        <ViewToggle view={view} onChange={setView} />
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors flex-shrink-0"
        >
          <Plus size={16} />
          <span>Add Project</span>
        </button>
      </div>

      {/* List or Grid */}
      {loading ? (
        <div className="text-sm text-[#555]">Loading projects...</div>
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

      {/* Add / Edit drawer */}
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
