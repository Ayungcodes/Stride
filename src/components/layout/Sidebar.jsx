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
    <aside className="fixed top-0 left-0 w-[220px] min-h-screen bg-[#141414] border-r border-[#2a2a2a] flex flex-col py-6 z-40">
      
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 pb-8 border-b border-[#2a2a2a] mb-4">
        <span className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
          FD
        </span>
        <span className="text-sm font-semibold text-[#f0f0f0] tracking-tight">
          FreelancerDesk
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 flex flex-col gap-0.5 px-3">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all duration-150
                ${isActive
                  ? "text-[#e8e8e8] bg-[#1f1f1f] border-l-2 border-indigo-500 pl-[10px]"
                  : "text-[#888] hover:text-[#e8e8e8] hover:bg-[#1f1f1f] border-l-2 border-transparent"
                }`}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pt-4 border-t border-[#2a2a2a] mt-2">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] font-medium text-[#888] hover:text-red-400 hover:bg-[#1f1f1f] transition-all duration-150 w-full text-left border-l-2 border-transparent"
        >
          <LogOut size={18} strokeWidth={1.8} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
