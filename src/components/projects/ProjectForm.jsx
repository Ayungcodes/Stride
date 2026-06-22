"use client";

import { useState, useEffect } from "react";
import { useClients } from "@/lib/hooks/useClients";

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
  const { clients } = useClients();

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

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      ...form,
      client_id: form.client_id || null,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Project name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#888]">
          Project name <span className="text-red-400">*</span>
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="e.g. Brand identity redesign"
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-[#e8e8e8] placeholder:text-[#444] focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
      </div>

      {/* Client */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#888]">Client</label>
        <select
          name="client_id"
          value={form.client_id}
          onChange={handleChange}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-[#e8e8e8] focus:outline-none focus:border-indigo-500/50 transition-colors appearance-none"
        >
          <option value="">No client</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#888]">Project details</label>
        <textarea
          name="details"
          value={form.details}
          onChange={handleChange}
          placeholder="What does this project involve?"
          rows={4}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-[#e8e8e8] placeholder:text-[#444] focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#888]">Start date</label>
          <input
            name="start_date"
            type="date"
            value={form.start_date}
            onChange={handleChange}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-[#e8e8e8] focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#888]">Due date</label>
          <input
            name="due_date"
            type="date"
            value={form.due_date}
            onChange={handleChange}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-[#e8e8e8] focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Status */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#888]">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-[#e8e8e8] focus:outline-none focus:border-indigo-500/50 transition-colors appearance-none"
        >
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="on_hold">On hold</option>
        </select>
      </div>

      {/* Actions */}
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
          className="flex-1 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-sm font-medium text-white transition-colors"
        >
          {loading ? "Saving..." : initial ? "Save changes" : "Add project"}
        </button>
      </div>
    </form>
  );
}
