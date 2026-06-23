"use client";

import { useEffect, useState } from "react";
import { useClients } from "@/lib/hooks/useClients";
import { useProjects } from "@/lib/hooks/useProjects";
import { useTasks } from "@/lib/hooks/useTasks";
import { useEarningsByYear } from "@/lib/hooks/useEarnings";
import { createClient } from "@/lib/supabase/client";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import {
  formatDate,
  formatCurrency,
  getPriority,
  priorityStyles,
  getClientStatus,
  getMonthName,
} from "@/lib/utils/formatters";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Clock, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const { clients, loading: clientsLoading } = useClients();
  const { projects, loading: projectsLoading } = useProjects();
  const { tasks, loading: tasksLoading } = useTasks();
  const { earnings, loading: earningsLoading } = useEarningsByYear(
    new Date().getFullYear()
  );

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name = user.user_metadata?.full_name || user.email.split("@")[0];
        setUserName(name.split(" ")[0]);
      }
    }
    getUser();
  }, []);

  const totalClients = clients.length;
  const activeClients = clients.filter(
    (c) => getClientStatus(c.projects) === "active"
  ).length;
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;

  const currentMonth = new Date().getMonth() + 1;
  const thisMonthEarnings = earnings.find((e) => e.month === currentMonth);
  const revenueThisMonth = thisMonthEarnings?.total || 0;

  const chartData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const found = earnings.find((e) => e.month === month);
    return {
      name: getMonthName(month).slice(0, 3),
      revenue: found ? Number(found.total) : 0,
    };
  });

  const today = new Date();
  const in14Days = new Date(today);
  in14Days.setDate(today.getDate() + 14);
  const upcoming = projects
    .filter((p) => {
      if (!p.due_date || p.status === "completed") return false;
      const due = new Date(p.due_date);
      return due >= today && due <= in14Days;
    })
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5);

  const recentTasks = tasks
    .filter((t) => t.status !== "done")
    .slice(0, 5);

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* Greeting */}
      <div className="flex items-end justify-between border-b border-stone-900/60 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-100 tracking-tight">
            {getGreeting()}{userName ? `, ${userName}` : ""}
          </h1>
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mt-1.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Metric Array Rows */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard label="Total Accounts" value={clientsLoading ? "..." : totalClients} variant="stone" />
        <StatCard label="Active Accounts" value={clientsLoading ? "..." : activeClients} variant="stone" />
        <StatCard label="Live Pipelines" value={projectsLoading ? "..." : activeProjects} variant="active" />
        <StatCard label="Issues Cleared" value={tasksLoading ? "..." : completedTasks} variant="completed" />
        <StatCard label="Monthly Velocity" value={earningsLoading ? "..." : formatCurrency(revenueThisMonth)} variant="progress" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Performance graph canvas */}
        <div className="lg:col-span-2 bg-stone-900/30 border border-stone-900/80 rounded-2xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xs font-bold text-stone-400 tracking-wider uppercase">
                Annual Yield Metrics · {new Date().getFullYear()}
              </h2>
              <p className="text-[11px] text-stone-500 font-medium mt-0.5">Continuous trajectory indexing</p>
            </div>
          </div>

          {earningsLoading ? (
            <div className="h-52 flex items-center justify-center text-xs text-stone-500 italic">
              Re-indexing performance arrays...
            </div>
          ) : (
            <div className="w-full h-52 -ml-2">
              <ResponsiveContainer width="100%" height="100__pct__">
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="lineGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="0"
                    stroke="#1c1917"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#57534e", fontSize: 10, fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#57534e", fontSize: 10, fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#0c0a09",
                      border: "1px solid #1c1917",
                      borderRadius: "12px",
                      padding: "10px 14px",
                    }}
                    labelStyle={{ color: "#a8a29e", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", tracking: "0.05em" }}
                    itemStyle={{ color: "#f59e0b", fontSize: "12px", fontWeight: 600 }}
                    formatter={(value) => [formatCurrency(value), "Yield"]}
                    cursor={{ stroke: "#292524", strokeWidth: 1 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#d97706"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4, fill: "#f59e0b", stroke: "#0c0a09", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Critical Targets */}
        <div className="bg-stone-900/30 border border-stone-900/80 rounded-2xl p-5 flex flex-col gap-4 backdrop-blur-sm self-stretch">
          <div>
            <h2 className="text-xs font-bold text-stone-400 tracking-wider uppercase">Critical Targets</h2>
            <p className="text-[11px] text-stone-500 font-medium mt-0.5">Upcoming 14-day window</p>
          </div>

          {upcoming.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 py-16 border border-dashed border-stone-900/60 rounded-xl bg-stone-950/20">
              <CheckCircle2 size={16} className="text-stone-700 mb-2" />
              <p className="text-xs text-stone-500 font-medium">All deadlines stabilized</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 flex-1 justify-center">
              {upcoming.map((project) => {
                const priority = getPriority(project.due_date);
                return (
                  <div
                    key={project.id}
                    onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                    className="flex items-center justify-between p-3 rounded-xl bg-stone-950/40 border border-stone-900/40 hover:border-stone-800/80 hover:bg-stone-900/20 cursor-pointer group transition-all"
                  >
                    <div className="min-w-0 flex flex-col gap-0.5">
                      <p className="text-xs font-semibold text-stone-300 group-hover:text-amber-500 transition-colors truncate max-w-[130px]">
                        {project.name}
                      </p>
                      <p className="text-[11px] text-stone-500 font-medium">{formatDate(project.due_date)}</p>
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${priorityStyles[priority]}`}>
                      {priority}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Critical Targets */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-stone-400 tracking-wider uppercase">Active Backlog Execution Matrix</h2>
            <span className="text-[10px] font-bold text-stone-500 bg-stone-900/60 px-2 py-0.5 rounded-md border border-stone-800/40">
              {recentTasks.length} Pending
            </span>
          </div>
          <button
            onClick={() => router.push("/dashboard/tasks")}
            className="text-xs font-bold text-stone-500 hover:text-amber-500 flex items-center gap-1 transition-colors group"
          >
            <span>Inspect Full Backlog</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {tasksLoading ? (
          <div className="text-xs text-stone-500 italic py-4">Re-mapping structural components...</div>
        ) : recentTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border border-dashed border-stone-900/60 rounded-2xl bg-stone-950/20">
            <Clock size={18} className="text-stone-700 mb-2" />
            <p className="text-xs text-stone-500 font-medium">No pending statements currently configured.</p>
          </div>
        ) : (
          <div className="flex flex-col bg-stone-900/10 border border-stone-900/80 rounded-2xl overflow-hidden backdrop-blur-sm">
            {recentTasks.map((task, index) => (
              <div
                key={task.id}
                className={`flex items-center justify-between px-5 py-4 hover:bg-stone-900/30 transition-colors gap-4
                  ${index !== recentTasks.length - 1 ? "border-b border-stone-900/50" : ""}`}
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-200 tracking-tight break-words">
                    {task.title}
                  </p>
                  <p className="text-xs text-stone-500 font-medium flex items-center gap-1.5 flex-wrap">
                    <span className="text-stone-400 truncate max-w-[180px]">
                      {task.projects?.name || "Independent Parameter"}
                    </span>
                    {task.due_date && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-stone-800" />
                        <span className="text-stone-500">Targeting {formatDate(task.due_date)}</span>
                      </>
                    )}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Badge label={task.status.replace("_", " ")} variant={task.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}