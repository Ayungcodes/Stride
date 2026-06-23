"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/utils/formatters";
import { User, ShieldCheck, LogOut, Loader2, AlertCircle, CheckCircle2, Lock } from "lucide-react";

export default function SettingsPage() {
  const [profile, setProfile] = useState({ full_name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({ password: "", confirm: "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);
  const [passwordMsg, setPasswordMsg] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Load current user
  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setProfile({
          full_name: user.user_metadata?.full_name || "",
          email: user.email || "",
        });
      }
      setInitialLoading(false);
    }
    loadUser();
  }, []);

  function showMsg(setter, type, text) {
    setter({ type, text });
    setTimeout(() => setter(null), 4000);
  }

  // Update profile
  async function handleProfileSubmit(e) {
    e.preventDefault();
    setProfileLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      data: { full_name: profile.full_name },
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ full_name: profile.full_name })
        .eq("id", user.id);
    }

    setProfileLoading(false);
    if (error) {
      showMsg(setProfileMsg, "error", error.message);
    } else {
      showMsg(setProfileMsg, "success", "Profile updated successfully.");
    }
  }

  // Update password
  async function handlePasswordSubmit(e) {
    e.preventDefault();
    if (passwordForm.password !== passwordForm.confirm) {
      showMsg(setPasswordMsg, "error", "Passwords do not match.");
      return;
    }
    if (passwordForm.password.length < 6) {
      showMsg(setPasswordMsg, "error", "Password must be at least 6 characters.");
      return;
    }

    setPasswordLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: passwordForm.password,
    });

    setPasswordLoading(false);
    if (error) {
      showMsg(setPasswordMsg, "error", error.message);
    } else {
      showMsg(setPasswordMsg, "success", "Password updated successfully.");
      setPasswordForm({ password: "", confirm: "" });
    }
  }

  if (initialLoading) {
    return (
      <div className="min-h-[400px] w-full flex items-center justify-center gap-2.5 text-stone-500 text-sm font-medium">
        <Loader2 size={16} className="animate-spin text-amber-500" />
        <span>Loading account configuration...</span>
      </div>
    );
  }

  const inputStyles = "w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-stone-200 placeholder:text-stone-700 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/40 transition-all duration-200";

  return (
    <div className="max-w-5xl mx-auto w-full animate-in fade-in duration-300 pb-16">
      
      {/* Header */}
      <div className="border-b border-stone-900 pb-6 mb-8">
        <h1 className="text-3xl font-semibold text-stone-100 tracking-tight">Settings</h1>
        <p className="text-sm text-stone-500 mt-1">Manage security clearances and identity parameters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        <div className="flex flex-col gap-4">
          <div className="bg-stone-900/20 border border-stone-900 rounded-2xl p-5 flex items-center gap-4 backdrop-blur-md">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-sm font-bold text-amber-500 select-none tracking-wider">
              {getInitials(profile.full_name || profile.email)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-stone-200 truncate">
                {profile.full_name || "Anonymous operator"}
              </p>
              <p className="text-xs text-stone-500 truncate mt-0.5">{profile.email}</p>
            </div>
          </div>

          <nav className="hidden md:flex flex-col gap-1 p-1 bg-stone-950 border border-stone-900/60 rounded-xl">
            <a href="#identity" className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-amber-500 bg-amber-500/5 border border-amber-500/10">
              <User size={14} /> Identity Management
            </a>
            <a href="#security" className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-900/40 transition-all">
              <ShieldCheck size={14} /> System Security
            </a>
          </nav>
        </div>

        <div className="md:col-span-2 flex flex-col gap-6">
          
          <section id="identity" className="bg-stone-900/10 border border-stone-900 rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden">
            <div className="flex items-start justify-between border-b border-stone-900/80 pb-4">
              <div>
                <h2 className="text-sm font-semibold text-stone-200 tracking-tight flex items-center gap-2">
                  <User size={15} className="text-stone-500" /> Public Identity
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">Update your display name</p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-stone-400">Display name</label>
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, full_name: e.target.value }))
                  }
                  placeholder="Your full name"
                  className={inputStyles}
                />
              </div>

              <div className="flex flex-col gap-1.5 opacity-70">
                <label className="text-xs font-medium text-stone-400 flex items-center gap-1.5">
                  Email endpoint <Lock size={11} className="text-stone-600" />
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full bg-stone-900/40 border border-stone-800/80 rounded-xl px-4 py-2.5 text-sm text-stone-600 cursor-not-allowed"
                />
                <p className="text-[11px] text-stone-600 italic">Email cannot be changed here</p>
              </div>

              {profileMsg && (
                <div className={`flex items-center gap-2 text-xs px-4 py-3 rounded-xl border animate-in fade-in slide-in-from-top-1 duration-200
                  ${profileMsg.type === "success"
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                    : "bg-red-500/5 border-red-500/20 text-red-400"
                  }`}
                >
                  {profileMsg.type === "success" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                  <span>{profileMsg.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={profileLoading}
                className="w-full h-11 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 text-sm font-semibold rounded-xl transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
              >
                {profileLoading ? <Loader2 size={16} className="animate-spin" /> : "Save changes"}
              </button>
            </form>
          </section>

          <section id="security" className="bg-stone-900/10 border border-stone-900 rounded-2xl p-6 flex flex-col gap-6">
            <div className="flex items-start justify-between border-b border-stone-900/80 pb-4">
              <div>
                <h2 className="text-sm font-semibold text-stone-200 tracking-tight flex items-center gap-2">
                  <ShieldCheck size={15} className="text-stone-500" /> System Security
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">Set a new password for your account</p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-stone-400">New password</label>
                <input
                  type="password"
                  value={passwordForm.password}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  placeholder="Minimum of 6 characters"
                  className={inputStyles}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-stone-400">Confirm password</label>
                <input
                  type="password"
                  value={passwordForm.confirm}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({ ...prev, confirm: e.target.value }))
                  }
                  placeholder="Confirm your new password"
                  className={inputStyles}
                />
              </div>

              {passwordMsg && (
                <div className={`flex items-center gap-2 text-xs px-4 py-3 rounded-xl border animate-in fade-in slide-in-from-top-1 duration-200
                  ${passwordMsg.type === "success"
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                    : "bg-red-500/5 border-red-500/20 text-red-400"
                  }`}
                >
                  {passwordMsg.type === "success" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                  <span>{passwordMsg.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full h-11 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 text-sm font-semibold rounded-xl transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
              >
                {passwordLoading ? <Loader2 size={16} className="animate-spin" /> : "Deploy credentials"}
              </button>
            </form>
          </section>

          <section className="border border-red-500/15 bg-red-500/[0.01] rounded-2xl p-6 flex flex-col gap-4">
            <div>
              <h2 className="text-sm font-semibold text-red-400 tracking-tight flex items-center gap-2">
                Boundary Zone
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Terminates all running access token payloads currently alive inside storage nodes.
              </p>
            </div>
            <button
              onClick={async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                window.location.href = "/login";
              }}
              className="w-full h-11 rounded-xl border border-red-500/20 hover:border-red-500/40 text-xs font-semibold text-red-400 hover:bg-red-500/5 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <LogOut size={13} />
              Sign out of all running devices
            </button>
          </section>

        </div>
      </div>
    </div>
  );
}