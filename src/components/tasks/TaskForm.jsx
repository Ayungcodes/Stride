"use client";

import { useState, useEffect } from "react";
import { useProjects } from "@/lib/hooks/useProjects";

const emptyForm = {
  title: "",
  description: "",
  project_id: "",
  status: "todo",
  due_date: "",
};

export default function TaskForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(emptyForm);
  const { projects = [] } = useProjects();

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || "",
        description: initial.description || "",
        project_id: initial.project_id || "",
        status: initial.status || "todo",
        due_date: initial.due_date ? initial.due_date.substring(0, 10) : "",
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
      project_id: form.project_id || null,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-1">
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-stone-400 tracking-wide">
          TASK TITLE <span className="text-red-500/90">*</span>
        </label>
        <input
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="e.g., Design landing page structure"
          className="bg-stone-950 border border-stone-800/80 rounded-xl px-4 py-2.5 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all duration-150"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-stone-400 tracking-wide">DESCRIPTION</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Any extra details, checklist references, or target milestones..."
          rows={3}
          className="bg-stone-950 border border-stone-800/80 rounded-xl px-4 py-2.5 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all duration-150 resize-none leading-relaxed"
        />
      </div>

      {/* Project Assignment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Project Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-stone-400 tracking-wide">PROJECT ASSIGNMENT</label>
          <div className="relative">
            <select
              name="project_id"
              value={form.project_id}
              onChange={handleChange}
              className="w-full bg-stone-950 border border-stone-800/80 rounded-xl px-4 py-2.5 text-sm text-stone-200 focus:outline-none focus:border-amber-500/50 transition-colors appearance-none cursor-pointer"
            >
              <option value="" className="bg-stone-900 text-stone-300">No project (standalone)</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-stone-900 text-stone-200">
                  {p.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* status */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-stone-400 tracking-wide">STATUS PROFILE</label>
          <div className="relative">
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full bg-stone-950 border border-stone-800/80 rounded-xl px-4 py-2.5 text-sm text-stone-200 focus:outline-none focus:border-amber-500/50 transition-colors appearance-none cursor-pointer"
            >
              <option value="todo" className="bg-stone-900 text-stone-200">To do</option>
              <option value="in_progress" className="bg-stone-900 text-stone-200">In progress</option>
              <option value="done" className="bg-stone-900 text-stone-200">Done</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Target Due Date */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-stone-400 tracking-wide">TARGET DUE DATE</label>
        <input
          name="due_date"
          type="date"
          value={form.due_date}
          onChange={handleChange}
          className="bg-stone-950 border border-stone-800/80 rounded-xl px-4 py-2.5 text-sm text-stone-200 focus:outline-none focus:border-amber-500/50 transition-colors custom-calendar-dark"
        />
      </div>

      {/* Action Footer */}
      <div className="flex gap-3 pt-4 border-t border-stone-900 mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-11 rounded-xl border border-stone-800 text-sm font-medium text-stone-400 hover:text-stone-200 hover:bg-stone-900/40 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 h-11 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-sm font-semibold text-stone-950 transition-all duration-150 active:scale-[0.99]"
        >
          {loading ? "Saving context..." : initial ? "Save changes" : "Create task"}
        </button>
      </div>
    </form>
  );
}