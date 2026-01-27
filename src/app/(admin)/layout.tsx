import { AppSidebar } from '@/features/components/app-sidebar';
import {
  SidebarProvider,
  SidebarTrigger,
} from '@/features/components/ui/sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
