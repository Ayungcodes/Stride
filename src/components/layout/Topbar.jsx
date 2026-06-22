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
  { href: "/dashboard",           label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/clients",   label: "Clients",   icon: Users },
  { href: "/dashboard/projects",  label: "Projects",  icon: FolderKanban },
  { href: "/dashboard/tasks",     label: "Tasks",     icon: CheckSquare },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/dashboard/settings",  label: "Settings",  icon: Settings },
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
      <header className="flex items-center justify-between px-5 h-14 bg-[#141414] border-b border-[#2a2a2a] sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center text-[11px] font-bold text-white">
            FD
          </span>
          <span className="text-sm font-semibold text-[#f0f0f0] tracking-tight">
            FreelancerDesk
          </span>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-[#888] hover:text-[#e8e8e8] transition-colors p-1"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile nav overlay */}
      {menuOpen && (
        <div className="fixed top-14 left-0 right-0 bottom-0 bg-[#141414] z-39 flex flex-col p-3 border-t border-[#2a2a2a]">
          <nav className="flex-1 flex flex-col gap-0.5">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] font-medium transition-all duration-150
                    ${isActive
                      ? "text-[#e8e8e8] bg-[#1f1f1f] border-l-2 border-indigo-500 pl-[14px]"
                      : "text-[#888] hover:text-[#e8e8e8] hover:bg-[#1f1f1f] border-l-2 border-transparent"
                    }`}
                >
                  <Icon size={18} strokeWidth={1.8} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-[#2a2a2a]">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] font-medium text-[#888] hover:text-red-400 hover:bg-[#1f1f1f] transition-all duration-150 w-full text-left border-l-2 border-transparent"
            >
              <LogOut size={18} strokeWidth={1.8} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
