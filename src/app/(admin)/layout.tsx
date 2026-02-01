import { AppSidebar } from '@/features/components/app-sidebar';
import { DynamicBreadcrumb } from '@/features/components/dynamic-breadcrumb';
import { Separator } from '@/features/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/features/components/ui/sidebar';
import { Toaster } from 'sonner';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <DynamicBreadcrumb />
        </header>
        <div className="p-4">{children}</div>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
