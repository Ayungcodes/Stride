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
  const { clients, loading, refetch } = useClients();
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
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#f0f0f0] tracking-tight">Clients</h1>
        <p className="text-sm text-[#555] mt-1">Manage your client relationships</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Clients" value={loading ? "..." : total} />
        <StatCard label="Active Clients" value={loading ? "..." : active} />
        <StatCard label="Inactive Clients" value={loading ? "..." : inactive} />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search clients..." />
        <ViewToggle view={view} onChange={setView} />
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors flex-shrink-0"
        >
          <Plus size={16} />
          <span>Add Client</span>
        </button>
      </div>

      {/* List or Grid */}
      {loading ? (
        <div className="text-sm text-[#555]">Loading clients...</div>
      ) : view === "list" ? (
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

      {/* Add / Edit drawer */}
      <Drawer
        open={drawerOpen}
        onClose={handleClose}
        title={editing ? "Edit client" : "Add client"}
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
