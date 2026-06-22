"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CheckSquare,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/clients", label: "Clients", icon: Users },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Topbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      {/* Topbar */}
      <header className="flex items-center justify-between px-5 h-14 bg-stone-950 border-b border-stone-800/60 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 bg-amber-500/10 border border-amber-500/30 rounded-md flex items-center justify-center text-[10px] font-bold text-amber-500 tracking-wider">
            FD
          </span>
          <span className="text-sm font-semibold text-stone-200 tracking-tight">
            FreelancerDesk
          </span>
        </div>

        {/* Menu toggle button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-stone-400 hover:text-stone-200 transition-all duration-300 p-1 rounded-md hover:bg-stone-900"
          aria-label="Toggle menu"
        >
          <div className={`transition-transform duration-300 ${menuOpen ? "rotate-90" : "rotate-0"}`}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </div>
        </button>
      </header>

      {/* Mobile nav overlay */}
      <div
        className={`fixed inset-x-0 bottom-0 top-14 bg-stone-950/95 backdrop-blur-md z-40 flex flex-col p-4 border-t border-stone-900 transition-all duration-300 ease-out
          ${menuOpen 
            ? "opacity-100 translate-y-0 pointer-events-auto" 
            : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
      >
        <nav className="flex-1 flex flex-col gap-1">
          {navLinks.map(({ href, label, icon: Icon }, index) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                style={{
                  transitionDelay: menuOpen ? `${index * 40}ms` : "0ms",
                }}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-200 group
                  ${menuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
                  ${
                    isActive
                      ? "text-stone-100 bg-stone-900/80 border-l border-amber-500 font-semibold"
                      : "text-stone-400 hover:text-stone-200 hover:bg-stone-900/40 border-l border-transparent"
                  }`}
              >
                <Icon 
                  size={18} 
                  strokeWidth={2} 
                  className={`transition-colors duration-200 ${isActive ? "text-amber-500" : "text-stone-500 group-hover:text-stone-300"}`} 
                />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div 
          className={`pt-4 border-t border-stone-900/60 transition-all duration-300 delay-200
            ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
        >
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] font-medium text-stone-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 w-full text-left"
          >
            <LogOut size={18} strokeWidth={2} className="text-stone-500 group-hover:text-red-400" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </>
  );
}