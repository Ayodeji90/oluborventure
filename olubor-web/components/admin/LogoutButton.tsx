"use client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };
  return (
    <button onClick={handleLogout}
      className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-[14px] font-medium text-white/60 hover:text-white hover:bg-white/10 transition">
      <LogOut className="w-4 h-4" /> Sign out
    </button>
  );
}
