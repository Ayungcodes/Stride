"use client";

import { useState, useEffect } from "react";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  notes: "",
  status: "active",
};

export default function ClientForm({ initial, onSubmit, loading }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || "",
        email: initial.email || "",
        phone: initial.phone || "",
        address: initial.address || "",
        notes: initial.notes || "",
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
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#888]">
          Full name <span className="text-red-400">*</span>
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="e.g. Felix Dalung"
          className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-[#e8e8e8] placeholder:text-[#444] focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#888]">Email address</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="felix@example.com"
          className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-[#e8e8e8] placeholder:text-[#444] focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#888]">Mobile number</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="+234 800 000 0000"
          className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-[#e8e8e8] placeholder:text-[#444] focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
      </div>

      {/* Address */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#888]">Address</label>
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Lagos, Nigeria"
          className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-[#e8e8e8] placeholder:text-[#444] focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
      </div>

      {/* Status */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#888]">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-[#e8e8e8] focus:outline-none focus:border-indigo-500/50 transition-colors"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#888]">Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={4}
          placeholder="Any extra notes about this client..."
          className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-[#e8e8e8] placeholder:text-[#444] focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors mt-2"
      >
        {loading ? "Saving..." : initial ? "Save changes" : "Add client"}
      </button>
    </form>
  );
}
