"use client";

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
} from "lucide-react";

const navLinks = [
  { href: "/dashboard",           label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/clients",   label: "Clients",   icon: Users },
  { href: "/dashboard/projects",  label: "Projects",  icon: FolderKanban },
  { href: "/dashboard/tasks",     label: "Tasks",     icon: CheckSquare },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/dashboard/settings",  label: "Settings",  icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="fixed top-0 left-0 w-[240px] h-screen bg-stone-950 border-r border-stone-900/60 flex flex-col py-5 z-40 hidden md:flex select-none">
      
      {/* Logo and accent */}
      <div className="flex items-center gap-3 px-5 pb-6 border-b border-stone-900/60 mb-5">
        <span className="w-8 h-8 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center justify-center text-[11px] font-bold text-amber-500 tracking-wider shadow-inner">
          FD
        </span>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-stone-200 tracking-tight leading-none mb-0.5">
            FreelancerDesk
          </span>
          <span className="text-[10px] text-stone-500 font-medium tracking-wide uppercase">
            Workspace
          </span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 flex flex-col gap-1 px-3">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-250 relative group
                ${isActive
                  ? "text-stone-100 bg-stone-900/60 shadow-sm shadow-black/20"
                  : "text-stone-400 hover:text-stone-200 hover:bg-stone-900/20"
                }`}
            >
              {/* Active indicator */}
              {isActive && (
                <span className="absolute left-0 w-[2px] h-4 bg-amber-500 rounded-r-full" />
              )}

              <Icon 
                size={18} 
                strokeWidth={2}
                className={`transition-all duration-300 transform group-hover:scale-105
                  ${isActive ? "text-amber-500" : "text-stone-500 group-hover:text-stone-300"}`} 
              />
              
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="px-3 pt-4 border-t border-stone-900/60 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium text-stone-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 w-full text-left group"
        >
          <LogOut 
            size={18} 
            strokeWidth={2} 
            className="text-stone-500 transition-colors duration-200 group-hover:text-red-400" 
          />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}