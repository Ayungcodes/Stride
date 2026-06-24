"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Login successful
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black relative overflow-hidden px-4 select-none">
      
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

      {/* Main structural auth card  */}
      <div className="w-full max-w-md bg-stone-900/20 border border-stone-900/80 rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-black/80 z-10 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-stone-950 border border-stone-800 mb-4 shadow-inner">
            <span className="text-xs font-black text-amber-500 tracking-widest">FD</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-100 tracking-tight">
            Welcome back
          </h1>
          <p className="text-xs font-semibold text-stone-500 tracking-wider uppercase mt-1.5">
            Authorize dashboard clearance
          </p>
        </div>

        {/* Form Content Controls Mapping */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Email input component anchor */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-400 tracking-wide uppercase">
              Email address
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600 transition-colors group-focus-within:text-amber-500/60">
                <Mail size={14} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@domain.com"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-stone-200 placeholder:text-stone-700 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/40 transition-all duration-200"
              />
            </div>
          </div>

          {/* Password input component anchor */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-400 tracking-wide uppercase">
                Password
              </label>
              <Link 
                href="/forgot-password" 
                className="text-[10px] font-bold text-stone-500 hover:text-amber-500 uppercase tracking-wide transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600 transition-colors group-focus-within:text-amber-500/60">
                <Lock size={14} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-stone-200 placeholder:text-stone-700 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/40 transition-all duration-200"
              />
            </div>
          </div>

          {/* Errors Matrix Alerts Block */}
          {error && (
            <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/[0.02] border border-red-500/20 px-4 py-3 rounded-xl animate-in fade-in slide-in-from-top-1 duration-150">
              <AlertCircle size={14} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Interactive Core Submit Trigger */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.99] shadow-lg shadow-amber-500/5 mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <>
                <span>Login</span>
                <ArrowRight size={14} strokeWidth={2.5} />
              </>
            )}
          </button>
        </form>

        {/* Dynamic Nav link footer boundary */}
        <p className="text-xs font-medium text-center text-stone-500 mt-8 tracking-wide">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-stone-300 hover:text-amber-500 font-semibold underline underline-offset-4 transition-colors">
            Register Operator
          </Link>
          .
        </p>
      </div>
    </div>
  );
}