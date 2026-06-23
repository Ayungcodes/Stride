"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Lock, ShieldCheck, AlertCircle, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();

    const { error: resetError } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  const inputStyles = "w-full bg-stone-950 border border-stone-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-stone-200 placeholder:text-stone-700 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/40 transition-all duration-200";
  const iconWrapperStyles = "absolute left-4 top-1/2 -translate-y-1/2 text-stone-600 transition-colors group-focus-within:text-amber-500/60";

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black relative overflow-hidden px-4 select-none">
      
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-stone-950 border border-stone-800 mb-4 shadow-inner">
            <span className="text-xs font-black text-amber-500 tracking-widest">FD</span>
          </div>
          <h1 className="text-xl font-bold text-stone-100 tracking-tight">
            FreelancerDesk Terminal
          </h1>
        </div>

        <div className="bg-stone-900/20 border border-stone-900/80 rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-black/80">
          
          <div className="mb-6 text-center sm:text-left">
            <h2 className="text-lg font-bold text-stone-200 tracking-tight flex items-center justify-center sm:justify-start gap-2">
              <ShieldCheck size={16} className="text-stone-500" /> Update Credentials
            </h2>
            <p className="text-xs font-medium text-stone-500 mt-1">
              Authorize your new system endpoint payload securely.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* New Password input block */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-400 tracking-wide uppercase">
                New access key
              </label>
              <div className="relative group">
                <div className={iconWrapperStyles}>
                  <Lock size={14} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className={inputStyles}
                />
              </div>
            </div>

            {/* Confirm Password input block */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-400 tracking-wide uppercase">
                Re-verify configuration
              </label>
              <div className="relative group">
                <div className={iconWrapperStyles}>
                  <Lock size={14} />
                </div>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Confirm password token"
                  className={inputStyles}
                />
              </div>
            </div>

            {/* Error Notification Block */}
            {error && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl animate-in fade-in slide-in-from-top-1 duration-150">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form Submit Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.99] shadow-lg shadow-amber-500/5 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Committing structural changes...</span>
                </>
              ) : (
                <span>Initialize New Key</span>
              )}
            </button>
          </form>

          {/* Fallback Escape Nav Anchor */}
          <div className="flex justify-center mt-6 border-t border-stone-900/60 pt-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-stone-300 transition-colors focus:outline-none"
            >
              <ArrowLeft size={13} strokeWidth={2.5} />
              <span>Back to access portal</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}