"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Mail, AlertCircle, Loader2, MailCheck, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSent(true);
  }

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
          {sent ? (
            
            /* Enhanced Success Validation View */
            <div className="flex flex-col items-center text-center gap-5 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-inner">
                <MailCheck size={20} strokeWidth={2} />
              </div>
              
              <div>
                <h2 className="text-base font-bold text-stone-200 tracking-tight">Verify endpoint pipeline</h2>
                <p className="text-xs font-medium text-stone-500 mt-1.5 max-w-xs leading-relaxed">
                  An encrypted credential payload has been routed to{" "}
                  <span className="text-stone-300 font-semibold break-all">{email}</span>
                </p>
              </div>

              <p className="text-[11px] font-medium text-stone-600 max-w-[250px] leading-relaxed">
                Missing the routing package? Check your filter arrays or{" "}
                <button
                  onClick={() => setSent(false)}
                  className="text-amber-500/80 hover:text-amber-400 font-bold underline underline-offset-2 transition-colors focus:outline-none"
                >
                  re-initialize request
                </button>
              </p>

              <div className="w-full border-t border-stone-900/60 pt-4 mt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-stone-300 transition-colors focus:outline-none"
                >
                  <ArrowLeft size={13} strokeWidth={2.5} />
                  <span>Return to access portal</span>
                </Link>
              </div>
            </div>
          ) : (
            
            /* Main Form Control View */
            <>
              <div className="mb-6 text-center sm:text-left">
                <h2 className="text-lg font-bold text-stone-200 tracking-tight flex items-center justify-center sm:justify-start gap-2">
                  <KeyRound size={16} className="text-stone-500" /> Recovery Initialization
                </h2>
                <p className="text-xs font-medium text-stone-500 mt-1">
                  Provide your authenticated routing address to generate a new key link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
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

                {error && (
                  <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/[0.02] border border-red-500/20 px-4 py-3 rounded-xl animate-in fade-in slide-in-from-top-1 duration-150">
                    <AlertCircle size={14} className="flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.99] shadow-lg shadow-amber-500/5 mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Transmitting key link...</span>
                    </>
                  ) : (
                    <span>Transmit Recovery Payload</span>
                  )}
                </button>
              </form>

              <div className="flex justify-center mt-6 border-t border-stone-900/60 pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-stone-300 transition-colors focus:outline-none"
                >
                  <ArrowLeft size={13} strokeWidth={2.5} />
                  <span>Return to access portal</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}