"use client";

import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { useClients, useClientMutations } from "@/lib/hooks/useClients";
import ClientList from "@/components/clients/ClientList";
import ClientGrid from "@/components/clients/ClientGrid";
import ClientForm from "@/components/clients/ClientForm";
import SearchBar from "@/components/ui/SearchBar";
import ViewToggle from "@/components/ui/ViewToggle";
import Drawer from "@/components/ui/Drawer";
import StatCard from "@/components/ui/StatCard";
import { getClientStatus } from "@/lib/utils/formatters";

export default function ClientsPage() {
  const { clients = [], loading, refetch } = useClients();
  const { create, update, remove, mutating } = useClientMutations();

  const [search, setSearch] = useState("");
  const [view, setView] = useState("list");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const total = clients.length;
  const active = clients.filter((c) => getClientStatus(c.projects) === "active").length;
  const inactive = total - active;

  // Filter by search
  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  function handleEdit(client) {
    setEditing(client);
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
      
      {/* Page header layout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-100 tracking-tight">Clients</h1>
          <p className="text-sm text-stone-500 mt-1">Manage and track your client relationships</p>
        </div>
        
        {/* CTA button */}
        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 px-4 h-10 bg-amber-500 hover:bg-amber-400 text-stone-950 text-sm font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-amber-500/10 flex-shrink-0"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Add Client</span>
        </button>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Clients" value={loading ? "..." : total} variant="stone" />
        <StatCard label="Active Clients" value={loading ? "..." : active} variant="active" />
        <StatCard label="Inactive Clients" value={loading ? "..." : inactive} variant="inactive" />
      </div>

      {/* Search and view toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full bg-stone-900/40 p-2 rounded-2xl border border-stone-900/60 backdrop-blur-sm">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search client directory..." />
        </div>
        <div className="flex items-center justify-end gap-2">
          <ViewToggle view={view} onChange={setView} />
        </div>
      </div>

      {/* Main interactive directory view area */}
      <div className="relative min-h-[200px]">
        {loading ? (
          <div className="flex items-center gap-3 text-sm text-stone-500 p-4 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            Loading workspace directory...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-12 rounded-2xl border border-dashed border-stone-900 bg-stone-900/10 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Users size={32} className="text-stone-600 mb-3" />
            <p className="text-sm font-medium text-stone-400">No matching clients found</p>
            <p className="text-xs text-stone-600 mt-1">Try tweaking your search term or add a new record</p>
          </div>
        ) : (
          <div key={view} className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
            {view === "list" ? (
              <ClientList
                clients={filtered}
                onEdit={handleEdit}
                onDelete={handleDelete}
                deleting={mutating}
              />
            ) : (
              <ClientGrid
                clients={filtered}
                onEdit={handleEdit}
                onDelete={handleDelete}
                deleting={mutating}
              />
            )}
          </div>
        )}
      </div>

      {/* Add / Edit configuration sheet */}
      <Drawer
        open={drawerOpen}
        onClose={handleClose}
        title={editing ? "Modify Client Profile" : "Onboard New Client"}
      >
        <ClientForm
          initial={editing}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          loading={mutating}
        />
      </Drawer>
    </div>
  );
}