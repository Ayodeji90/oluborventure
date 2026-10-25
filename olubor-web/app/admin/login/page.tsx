"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn } from "lucide-react";
import Emblem from "@/components/Emblem";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      router.push("/admin");
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Invalid email or password.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple flex items-center justify-center px-4 py-16">
      {/* Background texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple via-purple/95 to-purple-mid/80" aria-hidden />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Emblem variant="white" className="h-12 w-auto mb-3" />
          <p className="text-white/60 text-sm tracking-widest uppercase font-semibold">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-2xl font-bold text-ink mb-1">Sign in</h1>
          <p className="text-ink-3 text-[14px] mb-7">Access the Olubor Ventures dashboard.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5" htmlFor="email">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-3" />
                <input id="email" type="email" required autoComplete="email"
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="staff@oluborconsults.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-plum-100 text-[15px] text-ink focus:border-purple-mid focus:ring-2 focus:ring-purple-mid/20 outline-none transition" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5" htmlFor="password">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-3" />
                <input id="password" type="password" required autoComplete="current-password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-plum-100 text-[15px] text-ink focus:border-purple-mid focus:ring-2 focus:ring-purple-mid/20 outline-none transition" />
              </div>
            </div>

            {error && (
              <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
            )}

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 h-12 bg-purple-mid text-white font-semibold rounded-xl hover:bg-purple transition disabled:opacity-60 text-[15px]">
              {loading ? "Signing in…" : <><LogIn className="w-4 h-4" /> Sign in</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
