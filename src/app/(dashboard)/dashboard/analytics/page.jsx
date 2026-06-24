"use client";

import { useState } from "react";
import { Plus, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  useEarningsByYear,
  useEarningsByMonth,
  useEarningYears,
  useEarningMutations,
} from "@/lib/hooks/useEarnings";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import StatCard from "@/components/ui/StatCard";
import Drawer from "@/components/ui/Drawer";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { formatCurrency, getMonthName } from "@/lib/utils/formatters";

// ─── Earning Form ─────────────────────────────────────────────
function EarningForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(
    initial || { amount: "", description: "", date: "" }
  );

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#888]">
          Amount <span className="text-red-400">*</span>
        </label>
        <input
          name="amount"
          type="number"
          min="0"
          step="0.01"
          value={form.amount}
          onChange={handleChange}
          required
          placeholder="e.g. 150000"
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-[#e8e8e8] placeholder:text-[#444] focus:outline-none focus:border-amber-500/50 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#888]">Description</label>
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="e.g. Logo design payment"
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-[#e8e8e8] placeholder:text-[#444] focus:outline-none focus:border-amber-500/50 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#888]">
          Date <span className="text-red-400">*</span>
        </label>
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-[#e8e8e8] focus:outline-none focus:border-amber-500/50 transition-colors"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-lg border border-[#2a2a2a] text-sm text-[#888] hover:text-[#e8e8e8] hover:border-[#3a3a3a] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-sm font-medium text-white transition-colors"
        >
          {loading ? "Saving..." : initial ? "Save changes" : "Add earning"}
        </button>
      </div>
    </form>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs">
      <p className="text-[#555] mb-1">{label}</p>
      <p className="text-amber-400 font-semibold">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function AnalyticsPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingEarning, setEditingEarning] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const { earnings: yearlyEarnings, loading: yearlyLoading, refetch: refetchYearly } =
    useEarningsByYear(selectedYear);
  const { earnings: monthlyEarnings, total: monthTotal, loading: monthlyLoading, refetch: refetchMonthly } =
    useEarningsByMonth(selectedYear, selectedMonth);
  const { years } = useEarningYears();
  const { create, update, remove, mutating } = useEarningMutations();

  // Build 12-month chart data
  const chartData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const found = yearlyEarnings.find((e) => e.month === month);
    return {
      name: getMonthName(month).slice(0, 3),
      month,
      revenue: found ? Number(found.total) : 0,
    };
  });

  // Year total
  const yearTotal = yearlyEarnings.reduce((sum, e) => sum + Number(e.total), 0);

  // Best month
  const bestMonth = chartData.reduce(
    (best, m) => (m.revenue > best.revenue ? m : best),
    chartData[0]
  );

  // Growth vs previous month
  const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
  const prevMonthData = yearlyEarnings.find((e) => e.month === prevMonth);
  const prevTotal = prevMonthData ? Number(prevMonthData.total) : 0;
  const growth = prevTotal > 0
    ? Math.round(((monthTotal - prevTotal) / prevTotal) * 100)
    : null;

  function handleAdd() {
    setEditingEarning(null);
    setDrawerOpen(true);
  }

  function handleEdit(earning) {
    setEditingEarning(earning);
    setDrawerOpen(true);
  }

  function handleClose() {
    setDrawerOpen(false);
    setEditingEarning(null);
  }

  async function handleSubmit(formData) {
    if (editingEarning) {
      await update(editingEarning.id, formData);
    } else {
      await create(formData);
    }
    await refetchYearly();
    await refetchMonthly();
    handleClose();
  }

  async function handleDelete() {
    await remove(confirmId);
    await refetchYearly();
    await refetchMonthly();
    setConfirmId(null);
  }

  const availableYears = years.length > 0
    ? years
    : [currentYear];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#f0f0f0] tracking-tight">Analytics</h1>
          <p className="text-sm text-[#555] mt-1">Track your financial growth</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/5 text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={16} />
          Log earning
        </button>
      </div>

      {/* Year selector */}
      <div className="flex items-center gap-2">
        {availableYears.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${selectedYear === year
                ? "bg-amber-500 text-stone-950"
                : "bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] shadow-amber-500/5"
              }`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Year stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label={`Total Revenue ${selectedYear}`}
          value={yearlyLoading ? "..." : formatCurrency(yearTotal)}
        />
        <StatCard
          label="Best Month"
          value={yearlyLoading ? "..." : bestMonth?.revenue > 0 ? bestMonth.name : "—"}
          sub={bestMonth?.revenue > 0 ? formatCurrency(bestMonth.revenue) : undefined}
        />
        <StatCard
          label="Months Tracked"
          value={yearlyLoading ? "..." : yearlyEarnings.length}
          sub={`out of 12`}
        />
      </div>

      {/* Area chart — full year */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-[#e8e8e8] mb-1">
          Revenue overview — {selectedYear}
        </h2>
        <p className="text-xs text-[#555] mb-6">Click a month below to see the breakdown</p>

        {yearlyLoading ? (
          <div className="h-52 flex items-center justify-center text-sm text-[#555]">
            Loading chart...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "#555", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#555", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#2a2a2a" }} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#f59e0b"
                strokeWidth={2}
                fill="url(#amberGrad)"
                dot={{ fill: "#f59e0b", r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#f59e0b" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Month selector + breakdown */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <button
                key={month}
                onClick={() => setSelectedMonth(month)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                  ${selectedMonth === month
                    ? "bg-amber-500 text-stone-950"
                    : "bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] shadow-amber-500/5"
                  }`}
              >
                {getMonthName(month).slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* Month header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#e8e8e8]">
              {getMonthName(selectedMonth)} {selectedYear}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-[#555]">
                Total: <span className="text-amber-400 font-medium">{formatCurrency(monthTotal)}</span>
              </p>
              {growth !== null && (
                <span className={`flex items-center gap-0.5 text-xs font-medium
                  ${growth > 0 ? "text-emerald-400" : growth < 0 ? "text-red-400" : "text-[#555]"}`}
                >
                  {growth > 0
                    ? <TrendingUp size={12} />
                    : growth < 0
                    ? <TrendingDown size={12} />
                    : <Minus size={12} />}
                  {growth > 0 ? "+" : ""}{growth}% vs last month
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Monthly entries */}
        {monthlyLoading ? (
          <div className="text-sm text-[#555]">Loading entries...</div>
        ) : monthlyEarnings.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 text-center">
            <p className="text-sm text-[#555]">No earnings logged for this month.</p>
            <button
              onClick={handleAdd}
              className="mt-3 text-xs text-amber-400 hover:text-amber-300 transition-colors"
            >
              + Log an earning
            </button>
          </div>
        ) : (
          <div className="flex flex-col border border-[#2a2a2a] rounded-xl overflow-hidden">
            {monthlyEarnings.map((earning, index) => (
              <div
                key={earning.id}
                className={`flex items-center justify-between px-5 py-4 hover:bg-[#1f1f1f] transition-colors
                  ${index !== monthlyEarnings.length - 1 ? "border-b border-[#2a2a2a]" : ""}`}
              >
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium text-[#e8e8e8]">
                    {earning.description || "Earning"}
                  </p>
                  <p className="text-xs text-[#555]">{earning.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-amber-400">
                    {formatCurrency(earning.amount)}
                  </span>
                  <button
                    onClick={() => handleEdit(earning)}
                    className="text-xs text-[#555] hover:text-amber-400 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setConfirmId(earning.id)}
                    className="text-xs text-[#555] hover:text-red-400 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / edit earning drawer */}
      <Drawer
        open={drawerOpen}
        onClose={handleClose}
        title={editingEarning ? "Edit earning" : "Log earning"}
      >
        <EarningForm
          initial={editingEarning}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          loading={mutating}
        />
      </Drawer>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!confirmId}
        title="Delete earning?"
        description="This will remove this entry from your records."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
        loading={mutating}
      />
    </div>
  );
}