import type { ReactNode } from "react";
import { Suspense } from "react";
import type { Metadata } from "next";
import AuthProvider from "@/components/portal/AuthProvider";
import PortalHeader from "@/components/portal/PortalHeader";

export const metadata: Metadata = {
  title: "Client Portal",
  description: "Start and track your Olubor Ventures application.",
  robots: { index: false, follow: false },
};

/**
 * The header reads `usePathname()` and the application pages read `useParams()`,
 * both of which suspend while prerendering a route with a dynamic param that
 * isn't known at build time (application ids belong to users, so there is no
 * `generateStaticParams`). Suspense lets the shell prerender; the real UI
 * streams in on the client while Supabase SSR cookies carry the session.
 */
function PortalShellFallback() {
  return (
    <>
      <div className="mb-8" aria-hidden>
        <div className="h-4 w-24 rounded bg-plum-100/70 mb-3" />
        <div className="h-8 w-64 rounded bg-plum-100/70" />
      </div>
      <div className="flex items-center gap-3 text-ink-3 py-16 justify-center">
        <span className="text-[15px]">Loading your portal…</span>
      </div>
    </>
  );
}

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <section className="pt-32 pb-24 px-4 bg-sand min-h-[75vh]">
        <div className="max-w-5xl mx-auto">
          <Suspense fallback={<PortalShellFallback />}>
            <PortalHeader />
            {children}
          </Suspense>
        </div>
      </section>
    </AuthProvider>
  );
}
