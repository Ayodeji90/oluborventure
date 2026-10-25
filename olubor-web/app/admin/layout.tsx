import Link from "next/link";
import Emblem from "@/components/Emblem";
import LogoutButton from "@/components/admin/LogoutButton";

export const metadata = { title: "Admin — Olubor Ventures" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-purple text-white flex-col hidden lg:flex">
        <div className="px-6 py-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <Emblem variant="white" className="h-9 w-auto shrink-0" />
            <div className="leading-tight">
              <p className="font-bold text-[15px]">Olubor Ventures</p>
              <p className="text-white/50 text-[11px] tracking-widest uppercase">Admin</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link href="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium text-white/80 hover:text-white hover:bg-white/10 transition">
            Applications
          </Link>
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}
