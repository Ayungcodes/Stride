import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile topbar */}
      <div className="block md:hidden">
        <Topbar />
      </div>

      {/* Main content */}
      <main className="md:ml-[220px] p-5 md:p-9">
        {children}
      </main>
    </div>
  );
}
