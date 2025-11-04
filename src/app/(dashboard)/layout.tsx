import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SessionProvider } from "@/components/providers/session-provider";

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
