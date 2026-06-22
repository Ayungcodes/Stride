import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 antialiased flex flex-col md:flex-row relative overflow-x-hidden selection:bg-amber-500/20 selection:text-amber-200">
      
      {/* Ambient background glow */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-amber-500/[0.02] to-transparent pointer-events-none z-0" />

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile top header */}
      <div className="block md:hidden">
        <Topbar />
      </div>

      {/* Main content workspace viewport */}
      <main className="flex-1 min-w-0 md:ml-[240px] p-5 sm:p-6 md:p-10 lg:p-12 z-10 relative">
        <div className="max-w-[1500px] mx-auto w-full animate-in fade-in duration-500 ease-out">
          {children}
        </div>
      </main>
    </div>
  );
}