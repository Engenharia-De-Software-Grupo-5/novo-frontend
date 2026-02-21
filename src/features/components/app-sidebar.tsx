'use client';

import Link from 'next/link';
import { CondominiumSwitcher } from '@/features/components/condominium-switcher';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/features/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/features/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/features/components/ui/sidebar';
import {
  BookOpen,
  Bot,
  BriefcaseBusiness,
  ChevronRight,
  FileCheck,
  LogOut,
  MoreHorizontal,
  Receipt,
  Terminal,
  Users,
} from 'lucide-react';
import { signOut } from 'next-auth/react';

import { Role } from '@/types/user';

import { RoleGuard } from './auth/RoleGuard';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  condId?: string;
  user?: {
    name?: string | null;
    email?: string | null;
  };
}

interface NavSubItem {
  title: string;
  url: string;
  roles?: Role[];
}

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  items?: NavSubItem[];
  roles?: Role[];
}

export function AppSidebar({ condId, user, ...props }: AppSidebarProps) {
  // Configured default in case they are completely undefined via prop spread
  console.log(user);
  const name = user?.name || 'Admin User';
  const email = user?.email || 'admin@example.com';
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
  const getNavMain = (id: string): NavItem[] => [
    {
      title: 'Dashboard',
      url: `/condominios/${id}/dashboard`,
      icon: Bot,
    },
    {
      title: 'Imóveis',
      url: `/condominios/${id}/imoveis`,
      icon: BookOpen,
    },
    {
      title: 'Admin',
      url: '#',
      icon: Terminal,
      roles: ['Admin'] as Role[],
      items: [
        {
          title: 'Gerenciar Usuários',
          url: `/condominios/${id}/usuarios`,
        },
      ],
    },
    {
      title: 'Contratos',
      url: '#',
      icon: FileCheck,
      items: [
        {
          title: 'Gerenciar Contratos',
          url: `/condominios/${id}/contratos`,
        },
        {
          title: 'Modelos',
          url: `/condominios/${id}/modelos`,
        },
      ],
    },
    {
      title: 'Condôminos',
      url: '#',
      icon: Users,
      items: [
        {
          title: 'Gerenciar Condôminos',
          url: `/condominios/${id}/condominos`,
        },
        {
          title: 'Cobranças',
          url: `/condominios/${id}/cobrancas`,
          roles: ['Financeiro', 'Admin'] as Role[],
        },
      ],
    },
    {
      title: 'Funcionários',
      url: '#',
      icon: BriefcaseBusiness,
      items: [
        {
          title: 'Gerenciar Funcionários',
          url: `/condominios/${id}/funcionarios`,
          roles: ['RH', 'Admin'] as Role[],
        },
        {
          title: 'Pagamentos',
          url: `/condominios/${id}/pagamentos`,
          roles: ['Financeiro', 'Admin'] as Role[],
        },
      ],
    },
    {
      title: 'Despesas',
      url: `/condominios/${id}/despesas`,
      icon: Receipt,
    },
  ];

  const items = condId ? getNavMain(condId) : [];

  return (
    <Sidebar collapsible="icon" className="bg-[#fafafa]" {...props}>
      <SidebarHeader>
        <CondominiumSwitcher condId={condId} />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <SidebarMenu className="mt-4 px-2">
          {items.map((item) => {
            const itemNode = item.items ? (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={false}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      <item.icon />
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => {
                        const subItemNode = (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                        if (subItem.roles) {
                          return (
                            <RoleGuard
                              key={subItem.title}
                              roles={subItem.roles}
                            >
                              {subItemNode}
                            </RoleGuard>
                          );
                        }
                        return subItemNode;
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );

            if (item.roles) {
              return (
                <RoleGuard key={item.title} roles={item.roles}>
                  {itemNode}
                </RoleGuard>
              );
            }

            return itemNode;
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-black text-white">
                    <span className="text-xs font-bold">{initials}</span>
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{name}</span>
                    <span className="truncate text-xs">{email}</span>
                  </div>
                  <MoreHorizontal className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              >
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: '/auth/login' })}
                >
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
