import Link from 'next/link';
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

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  condId?: string;
}

export function AppSidebar({ condId, ...props }: AppSidebarProps) {
  const getNavMain = (id: string) => [
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
        },
        {
          title: 'Pagamentos',
          url: `/condominios/${id}/pagamentos`,
        },
      ],
    },
    {
      title: 'Despesas',
      url: '#',
      icon: Receipt,
      items: [
        {
          title: 'Condomínio',
          url: `/condominios/${id}/despesas/condominio`,
        },
        {
          title: 'Imóveis',
          url: `/condominios/${id}/despesas/imoveis`,
        },
      ],
    },
  ];

  const items = condId ? getNavMain(condId) : [];

  return (
    <Sidebar collapsible="icon" className="bg-[#fafafa]" {...props}>
      <SidebarContent className="gap-0">
        <SidebarMenu className="mt-4 px-2">
          {items.map((item) => {
            if (item.items) {
              return (
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
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            }
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
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
                    <span className="text-xs font-bold">CN</span>
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Admin User</span>
                    <span className="truncate text-xs">admin@example.com</span>
                  </div>
                  <MoreHorizontal className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              >
                <DropdownMenuItem>
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
