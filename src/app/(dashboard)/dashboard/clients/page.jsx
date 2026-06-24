"use client";

import { useState } from "react";
import { Plus, Users, CheckCircle2, XCircle } from "lucide-react";
import { useClients, useClientMutations } from "@/lib/hooks/useClients";
import ClientList from "@/components/clients/ClientList";
import ClientGrid from "@/components/clients/ClientGrid";
import ClientForm from "@/components/clients/ClientForm";
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
import { getClientStatus } from "@/lib/utils/formatters";

export default function ClientsPage() {
  const { clients = [], loading, error, refetch } = useClients();
  const { create, update, remove, mutating } = useClientMutations();

  const [search, setSearch] = useState("");
  const [view, setView] = useState("list");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Compute stats safely
  const total = clients?.length || 0;
  const active = clients?.filter((c) => c?.status === "active").length || 0;
  const inactive = Math.max(0, total - active);

  // Structural dynamic matching query tracking
  const filtered =
    clients?.filter(
      (c) =>
        c?.name?.toLowerCase().includes(search.toLowerCase()) ||
        c?.email?.toLowerCase().includes(search.toLowerCase()),
    ) || [];

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
    if (editing) await update(editing.id, formData);
    else await create(formData);
    await refetch();
    handleClose();
  }

  async function handleDelete(id) {
    await remove(id);
    await refetch();
  }

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-stone-900 pb-6">
        <h1 className="text-3xl font-semibold text-stone-100 tracking-tight">
          Clients
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Monitor your customer node pipelines and active engagement metrics
        </p>
      </div>

      {loading ? (
        <StatCardsSkeleton count={3} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Clients"
            value={total}
            icon={<Users className="text-stone-500" size={16} />}
          />
          <StatCard
            label="Active Connections"
            value={active}
            icon={<CheckCircle2 className="text-emerald-500/70" size={16} />}
          />
          <StatCard
            label="Inactive Nodes"
            value={inactive}
            icon={<XCircle className="text-stone-600" size={16} />}
          />
        </div>
      )}

      <div className="flex items-center gap-3 bg-stone-900/10 border border-stone-900/60 p-3 rounded-xl backdrop-blur-sm w-full">
        <div className="flex-1 min-w-0">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Filter database profiles..."
          />
        </div>

        <ViewToggle view={view} onChange={setView} />

        <button
          onClick={handleAdd}
          className="h-10 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] shadow-lg shadow-amber-500/5 flex-shrink-0"
        >
          <Plus size={15} strokeWidth={2.5} />
          <span className="hidden sm:inline">Add Client</span>
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
          <div className="w-full border border-stone-900 bg-stone-950/20 rounded-2xl p-16 flex flex-col items-center justify-center text-center gap-2">
            <Users size={24} className="text-stone-700 mb-2" />
            <p className="text-sm font-medium text-stone-300">
              No database structures found
            </p>
            <p className="text-xs text-stone-600 max-w-xs">
              Your criteria matrix matched 0 profile listings currently stored.
            </p>
          </div>
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
      </div>

      <Drawer
        open={drawerOpen}
        onClose={handleClose}
        title={editing ? "Update client blueprint" : "Register client node"}
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
