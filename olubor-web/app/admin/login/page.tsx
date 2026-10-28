"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Emblem from "@/components/Emblem";

const floatingLogos = [
  { top: "5%", left: "8%", size: 90, duration: "18s", delay: "0s" },
  { top: "12%", right: "10%", size: 70, duration: "22s", delay: "3s" },
  { top: "55%", left: "5%", size: 60, duration: "20s", delay: "1s" },
  { top: "70%", right: "8%", size: 100, duration: "25s", delay: "5s" },
  { top: "35%", left: "80%", size: 55, duration: "19s", delay: "2s" },
  { top: "85%", left: "45%", size: 75, duration: "23s", delay: "4s" },
  { top: "20%", left: "35%", size: 50, duration: "21s", delay: "6s" },
  { top: "65%", left: "25%", size: 65, duration: "17s", delay: "1.5s" },
];

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
    <div className="relative min-h-screen bg-[#e8eaf2] flex items-center justify-center px-4 py-16 overflow-hidden">
      <style>{`
        @keyframes tile-scroll {
          from { background-position: 0 0; }
          to   { background-position: 160px 110px; }
        }
        @keyframes float-drift {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25%      { transform: translateY(-18px) rotate(3deg); }
          50%      { transform: translateY(-8px) rotate(-2deg); }
          75%      { transform: translateY(-22px) rotate(1deg); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          from { background-position: -200% center; }
          to   { background-position: 200% center; }
        }
        .login-fade-up {
          animation: fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .login-scale-in {
          animation: scale-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .login-shimmer-btn {
          background-size: 200% 100%;
          background-image: linear-gradient(
            110deg,
            var(--color-purple) 0%,
            var(--color-purple) 40%,
            var(--color-purple-mid) 50%,
            var(--color-purple) 60%,
            var(--color-purple) 100%
          );
        }
        .login-shimmer-btn:hover {
          animation: shimmer 2s linear infinite;
        }
      `}</style>

      {/* Layer 1: Scrolling tiled watermark */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        aria-hidden="true"
        style={{
          backgroundImage: "url(/logo.webp)",
          backgroundSize: "160px 110px",
          backgroundRepeat: "repeat",
          animation: "tile-scroll 12s linear infinite",
        }}
      />

      {/* Layer 2: Radial vignette overlay */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(1,24,116,0.06) 100%)",
        }}
      />

      {/* Layer 3: Floating logos at different depths */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {floatingLogos.map((l, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: l.top,
              left: l.left,
              right: l.right,
              animation: `float-drift ${l.duration} ease-in-out ${l.delay} infinite`,
            }}
          >
            <Image
              src="/logo.webp"
              alt=""
              width={l.size}
              height={Math.round(l.size * 0.7)}
              className="opacity-[0.05] select-none"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Login content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo badge */}
        <div className="flex flex-col items-center mb-8 login-scale-in" style={{ animationDelay: "0.1s" }}>
          <div className="bg-purple rounded-2xl p-5 shadow-xl mb-4 ring-4 ring-purple/10">
            <Emblem variant="white" className="h-14 w-auto" />
          </div>
          <p className="text-purple font-bold text-lg tracking-wide">Olubor Ventures</p>
          <div className="flex items-center gap-1.5 mt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-mid" />
            <p className="text-ink-2 text-xs tracking-widest uppercase font-semibold">Admin Portal</p>
          </div>
        </div>

        {/* Card with glassmorphism */}
        <div
          className="login-fade-up rounded-2xl shadow-2xl border border-white/60 p-8"
          style={{
            animationDelay: "0.3s",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <h1 className="text-2xl font-bold text-ink mb-1">Sign in</h1>
          <p className="text-ink-3 text-[14px] mb-7">Access the Olubor Ventures dashboard.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="login-fade-up" style={{ animationDelay: "0.45s" }}>
              <label className="block text-sm font-semibold text-ink mb-1.5" htmlFor="email">Email address</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-3 group-focus-within:text-purple-mid transition" />
                <input id="email" type="email" required autoComplete="email"
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="staff@oluborconsults.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-white/70 text-[15px] text-ink focus:border-purple-mid focus:ring-2 focus:ring-purple-mid/20 focus:bg-white outline-none transition-all" />
              </div>
            </div>
            <div className="login-fade-up" style={{ animationDelay: "0.55s" }}>
              <label className="block text-sm font-semibold text-ink mb-1.5" htmlFor="password">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-3 group-focus-within:text-purple-mid transition" />
                <input id="password" type="password" required autoComplete="current-password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-white/70 text-[15px] text-ink focus:border-purple-mid focus:ring-2 focus:ring-purple-mid/20 focus:bg-white outline-none transition-all" />
              </div>
            </div>

            {error && (
              <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
            )}

            <div className="login-fade-up" style={{ animationDelay: "0.65s" }}>
              <button type="submit" disabled={loading}
                className="login-shimmer-btn w-full flex items-center justify-center gap-2.5 h-12 bg-purple text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple/25 active:scale-[0.98] transition-all disabled:opacity-60 text-[15px]">
                {loading ? "Signing in…" : <><LogIn className="w-4 h-4" /> Sign in</>}
              </button>
            </div>
          </form>

          <p className="text-center text-ink-3 text-[12px] mt-6 login-fade-up" style={{ animationDelay: "0.75s" }}>
            Staff accounts only. Contact your administrator for access.
          </p>
        </div>
      </div>
    </div>
  );
}
