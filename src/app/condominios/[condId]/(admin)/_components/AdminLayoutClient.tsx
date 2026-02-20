// app/(admin)/_components/AdminLayoutClient.tsx  ← Client Component
'use client'

import { useAuth } from '@/contexts/AuthContext'
import { AppSidebar } from '@/features/components/app-sidebar'
import { DynamicBreadcrumb } from '@/features/components/dynamic-breadcrumb'
import { Separator } from '@/features/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/features/components/ui/sidebar'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !user) {
      router.push('/login')
    }
  }, [user, mounted, router])

  if (!mounted || !user) {
    return null // ou um loading spinner
  }

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
      </SidebarInset>
    </SidebarProvider>
  )
}