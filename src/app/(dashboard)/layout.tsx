import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SessionProvider } from "@/components/providers/session-provider";

// Force dynamic rendering for all dashboard pages (Next.js 16)
export const dynamic = "force-dynamic";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </SessionProvider>
  );
}
