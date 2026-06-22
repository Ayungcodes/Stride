"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

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

  function setStatusValue(value) {
    setForm((prev) => ({ ...prev, status: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  const inputStyles = "w-full bg-stone-900/40 border border-stone-800/80 rounded-xl px-4 py-2.5 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/40 transition-all duration-200";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-0.5">
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-stone-400">
          Full name <span className="text-red-400">*</span>
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="e.g. Felix Dalung"
          className={inputStyles}
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-stone-400">Email address</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="felix@example.com"
          className={inputStyles}
        />
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-stone-400">Mobile number</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="+234 800 000 0000"
          className={inputStyles}
        />
      </div>

      {/* Address */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-stone-400">Address</label>
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Lagos, Nigeria"
          className={inputStyles}
        />
      </div>

      {/* Status*/}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-stone-400">Status</label>
        <div className="relative flex p-1 bg-stone-950 rounded-xl border border-stone-900 overflow-hidden h-11 items-center">
          
          {/* Animated sliding capsule backdrop */}
          <div 
            className={`absolute top-1 bottom-1 rounded-lg bg-amber-500/10 border border-amber-500/20 transition-all duration-300 ease-out w-[calc(50%-6px)]
              ${form.status === "active" ? "left-1" : "left-[calc(50%+2px)]"}`}
          />

          {/* Active Option Button */}
          <button
            type="button"
            onClick={() => setStatusValue("active")}
            className={`flex-1 flex items-center justify-center gap-2 text-xs font-medium z-10 h-full transition-colors duration-200
              ${form.status === "active" ? "text-amber-500 font-semibold" : "text-stone-500 hover:text-stone-300"}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${form.status === "active" ? "bg-amber-500 shadow-sm shadow-amber-500 animate-pulse" : "bg-stone-700"}`} />
            Active
          </button>

          {/* Inactive Option Button */}
          <button
            type="button"
            onClick={() => setStatusValue("inactive")}
            className={`flex-1 flex items-center justify-center gap-2 text-xs font-medium z-10 h-full transition-colors duration-200
              ${form.status === "inactive" ? "text-stone-300 font-semibold" : "text-stone-500 hover:text-stone-300"}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${form.status === "inactive" ? "bg-stone-400" : "bg-stone-700"}`} />
            Inactive
          </button>
        </div>
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-stone-400">Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={4}
          placeholder="Any extra notes about this client..."
          className={`${inputStyles} resize-none`}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 text-sm font-semibold rounded-xl transition-all duration-200 active:scale-[0.99] mt-2 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Saving...</span>
          </>
        ) : (
          <span>{initial ? "Save changes" : "Add client"}</span>
        )}
      </button>
    </form>
  );
}