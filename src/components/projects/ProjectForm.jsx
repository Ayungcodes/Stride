"use client";

import { useState, useEffect } from "react";
import { useClients } from "@/lib/hooks/useClients";
import { Loader2, ChevronDown } from "lucide-react";

const emptyForm = {
  name: "",
  client_id: "",
  details: "",
  start_date: "",
  due_date: "",
  status: "active",
};

export default function ProjectForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(emptyForm);
  const { clients = [] } = useClients();

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || "",
        client_id: initial.client_id || "",
        details: initial.details || "",
        start_date: initial.start_date || "",
        due_date: initial.due_date || "",
        status: initial.status || "active",
      });
    } else {
      setForm(emptyForm);
    }
  }, [initial]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function setStatusValue(value) {
    setForm((prev) => ({ ...prev, status: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      ...form,
      client_id: form.client_id || null,
    });
  }

  const inputStyles = "w-full bg-stone-900/40 border border-stone-800/80 rounded-xl px-4 py-2.5 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/40 transition-all duration-200 appearance-none";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-0.5">
      {/* Project name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-stone-400">
          Project name <span className="text-red-400">*</span>
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="e.g. Brand identity redesign"
          className={inputStyles}
        />
      </div>

      {/* Client dropdown */}
      <div className="flex flex-col gap-1.5 relative">
        <label className="text-xs font-medium text-stone-400">Client</label>
        <div className="relative w-full">
          <select
            name="client_id"
            value={form.client_id}
            onChange={handleChange}
            className={inputStyles}
          >
            <option value="">No client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500">
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      {/* Project details */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-stone-400">Project details</label>
        <textarea
          name="details"
          value={form.details}
          onChange={handleChange}
          placeholder="What does this project involve?"
          rows={4}
          className={`${inputStyles} resize-none`}
        />
      </div>

      {/* Grid timelines */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-stone-400">Start date</label>
          <input
            name="start_date"
            type="date"
            value={form.start_date}
            onChange={handleChange}
            className={`${inputStyles} [color-scheme:dark] cursor-pointer`}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-stone-400">Due date</label>
          <input
            name="due_date"
            type="date"
            value={form.due_date}
            onChange={handleChange}
            className={`${inputStyles} [color-scheme:dark] cursor-pointer`}
          />
        </div>
      </div>

      {/* Status Toggle */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-stone-400">Status</label>
        <div className="relative flex p-1 bg-stone-950 rounded-xl border border-stone-900 overflow-hidden h-11 items-center select-none">
          
          <div 
            className="absolute top-1 bottom-1 rounded-lg bg-amber-500/10 border border-amber-500/20 transition-all duration-300 ease-out w-[calc(33.333%-4px)]"
            style={{
              left: form.status === "active" 
                ? "4px" 
                : form.status === "completed" 
                ? "calc(33.333% + 2px)" 
                : "calc(66.666% + 0px)"
            }}
          />

          {/* Active option */}
          <button
            type="button"
            onClick={() => setStatusValue("active")}
            className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium z-10 h-full transition-colors duration-200
              ${form.status === "active" ? "text-amber-500 font-semibold" : "text-stone-500 hover:text-stone-300"}`}
          >
            <span className={`w-1 h-1 rounded-full ${form.status === "active" ? "bg-amber-500 animate-pulse shadow shadow-amber-500" : "bg-stone-700"}`} />
            Active
          </button>

          {/* Completed option */}
          <button
            type="button"
            onClick={() => setStatusValue("completed")}
            className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium z-10 h-full transition-colors duration-200
              ${form.status === "completed" ? "text-emerald-400 font-semibold" : "text-stone-500 hover:text-stone-300"}`}
          >
            <span className={`w-1 h-1 rounded-full ${form.status === "completed" ? "bg-emerald-400" : "bg-stone-700"}`} />
            Completed
          </button>

          {/* On hold option */}
          <button
            type="button"
            onClick={() => setStatusValue("on_hold")}
            className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium z-10 h-full transition-colors duration-200
              ${form.status === "on_hold" ? "text-amber-600 font-semibold" : "text-stone-500 hover:text-stone-300"}`}
          >
            <span className={`w-1 h-1 rounded-full ${form.status === "on_hold" ? "bg-amber-600" : "bg-stone-700"}`} />
            On hold
          </button>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-11 rounded-xl border border-stone-800/80 text-sm font-medium text-stone-400 hover:text-stone-200 hover:bg-stone-900/40 transition-all duration-200 active:scale-[0.99]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 h-11 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 text-sm font-semibold transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>{initial ? "Save changes" : "Add project"}</span>
          )}
        </button>
      </div>
    </form>
  );
}