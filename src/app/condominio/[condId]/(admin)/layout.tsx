'use client';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AppSidebar } from '@/features/components/app-sidebar';
import { DynamicBreadcrumb } from '@/features/components/dynamic-breadcrumb';
import { Separator } from '@/features/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/features/components/ui/sidebar';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {  

  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Garante que o código só rode no cliente para ler o localStorage corretamente
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push('/login'); 
    }
  }, [user, mounted, router]);

  // Enquanto o componente não "montou" ou não tem usuário, não mostra nada
  
  if (!mounted || !user) {
    return null; 
  }
  
  return (
    <SidebarProvider defaultOpen={true}>
      <AuthProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumb />
          </header>
          <div className="p-4">{children}</div>
        </SidebarInset>
      </AuthProvider>
    </SidebarProvider>
  );
}
