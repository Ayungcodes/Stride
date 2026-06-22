"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Phone, MapPin, FileText, FolderKanban, Calendar } from "lucide-react";
import { useClient } from "@/lib/hooks/useClients";
import { getInitials, getClientStatus, formatDate, getPriority, priorityStyles } from "@/lib/utils/formatters";
import Badge from "@/components/ui/Badge";
import StatCard from "@/components/ui/StatCard";
import EmptyState from "@/components/ui/EmptyState";

export default function ClientDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { client, loading, error } = useClient(id);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3 animate-pulse">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
        <p className="text-sm text-stone-500">Loading profile schema...</p>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 text-center max-w-sm mx-auto animate-in fade-in duration-300">
        <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
          <p className="text-sm font-medium text-stone-400">Client context missing or corrupted.</p>
        </div>
        <button
          onClick={() => router.push("/dashboard/clients")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-amber-500 hover:text-amber-400 bg-amber-500/5 hover:bg-amber-500/10 px-4 h-9 rounded-xl border border-amber-500/10 transition-all active:scale-95"
        >
          <ArrowLeft size={14} />
          <span>Return to Directory</span>
        </button>
      </div>
    );
  }

  const status = getClientStatus(client.projects || []);
  const projects = client.projects || [];
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const completedProjects = projects.filter((p) => p.status === "completed").length;
  const isActive = status === "active";

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* Back action */}
      <div>
        <button
          onClick={() => router.push("/dashboard/clients")}
          className="flex items-center gap-2 text-xs font-medium text-stone-500 hover:text-stone-200 transition-colors group w-fit"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to clients</span>
        </button>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-stone-900/60">
        <div className="flex items-center gap-4.5">
          <div className="w-16 h-16 rounded-2xl bg-stone-900 border border-stone-800/80 flex items-center justify-center text-xl font-bold text-amber-500 shadow-inner">
            {getInitials(client.name)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-100 tracking-tight">
              {client.name}
            </h1>
            <div className="flex items-center gap-2 text-xs text-stone-500 mt-1.5">
              <Calendar size={13} className="text-stone-600" />
              <span>Partner since {formatDate(client.created_at)}</span>
            </div>
          </div>
        </div>
        <div className="self-start sm:self-center">
          <Badge
            label={isActive ? "Active Account" : "Inactive Profile"}
            variant={isActive ? "active" : "inactive"}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Projects" value={projects.length} variant="stone" />
        <StatCard label="Active Branches" value={activeProjects} variant="active" />
        <StatCard label="Completed Maps" value={completedProjects} variant="completed" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
        
        {/* Contact Info */}
        <div className="md:col-span-2 bg-stone-900/30 border border-stone-900/80 rounded-2xl p-5 flex flex-col gap-4 backdrop-blur-sm">
          <h2 className="text-xs font-bold text-stone-400 tracking-wider uppercase">Contact Channels</h2>
          <div className="flex flex-col gap-3.5">
            {client.email ? (
              <div className="flex items-center gap-3 text-sm group min-w-0">
                <Mail size={14} className="text-stone-600 flex-shrink-0" />
                <span className="text-stone-300 font-medium truncate hover:text-amber-500 cursor-pointer transition-colors duration-150">
                  {client.email}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-sm italic">
                <Mail size={14} className="text-stone-800 flex-shrink-0" />
                <span className="text-stone-600">No email provided</span>
              </div>
            )}
            
            {client.phone ? (
              <div className="flex items-center gap-3 text-sm min-w-0">
                <Phone size={14} className="text-stone-600 flex-shrink-0" />
                <span className="text-stone-300 font-medium truncate">{client.phone}</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-sm italic">
                <Phone size={14} className="text-stone-800 flex-shrink-0" />
                <span className="text-stone-600">No phone recorded</span>
              </div>
            )}

            {client.address ? (
              <div className="flex items-start gap-3 text-sm min-w-0">
                <MapPin size={14} className="text-stone-600 flex-shrink-0 mt-0.5" />
                <span className="text-stone-300 font-medium text-xs leading-relaxed break-words">
                  {client.address}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-sm italic">
                <MapPin size={14} className="text-stone-800 flex-shrink-0" />
                <span className="text-stone-600">No layout address</span>
              </div>
            )}
          </div>
        </div>

        {/* Strategic Notes */}
        <div className="md:col-span-3 bg-stone-900/30 border border-stone-900/80 rounded-2xl p-5 flex flex-col gap-4 backdrop-blur-sm self-stretch">
          <h2 className="text-xs font-bold text-stone-400 tracking-wider uppercase">Strategic Notes</h2>
          {client.notes ? (
            <div className="bg-stone-950/40 border border-stone-900/60 p-4 rounded-xl h-full">
              <p className="text-sm text-stone-400 leading-relaxed whitespace-pre-wrap font-medium">
                {client.notes}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-sm italic h-full p-4 bg-stone-950/20 border border-stone-900/40 rounded-xl">
              <FileText size={14} className="text-stone-700 flex-shrink-0" />
              <span className="text-stone-600">No operational notes attached to account</span>
            </div>
          )}
        </div>
      </div>

      {/* Project Pipeline */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-stone-400 tracking-wider uppercase">Project Pipeline</h2>
          <span className="text-xs font-medium text-stone-500 bg-stone-900/60 px-2 py-0.5 rounded-md border border-stone-800/40">
            {projects.length} Found
          </span>
        </div>

        {projects.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="No projects linked"
            description="Projects configured for this client ledger map will show up here"
          />
        ) : (
          <div className="flex flex-col bg-stone-900/10 border border-stone-900/80 rounded-2xl overflow-hidden backdrop-blur-sm">
            {projects.map((project, index) => {
              const priority = getPriority(project.due_date);
              return (
                <div
                  key={project.id}
                  onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 cursor-pointer hover:bg-stone-900/40 transition-all group gap-3
                    ${index !== projects.length - 1 ? "border-b border-stone-900/50" : ""}`}
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <p className="text-sm font-semibold text-stone-200 group-hover:text-amber-500 transition-colors duration-150 truncate">
                      {project.name}
                    </p>
                    {project.due_date && (
                      <div className="flex items-center gap-1.5 text-xs text-stone-500">
                        <span className="w-1 h-1 rounded-full bg-stone-700" />
                        <span>Due {formatDate(project.due_date)}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Priority and Status */}
                  <div className="flex items-center gap-3.5 self-end sm:self-center flex-shrink-0">
                    {priority !== "none" && (
                      <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md font-bold border ${priorityStyles[priority] || 'border-stone-800 bg-stone-900 text-stone-400'}`}>
                        {priority}
                      </span>
                    )}
                    <Badge
                      label={project.status.replace("_", " ")}
                      variant={project.status}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}