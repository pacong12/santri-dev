"use client"

import * as React from "react"
import {
  LayoutDashboard,
  School,
  Settings,
  ClipboardList,
  GraduationCap,
  Receipt,
  UserCog,
  Command
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar"

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole: 'SUPERADMIN' | 'OWNER' | 'ADMIN' | null;
  name: string;
  email: string;
  onLogout?: () => void;
}

export function AppSidebar({ userRole, name, email, onLogout, ...props }: AppSidebarProps) {
  // Determine menu items based on role
  const getNavMain = () => {
    if (userRole === 'SUPERADMIN') {
      return [
        {
          title: "Overview",
          url: "/superadmin",
          icon: LayoutDashboard,
        },
        {
          title: "Daftar Pesantren",
          url: "/tenants",
          icon: School,
        },
        {
          title: "Transaksi Global",
          url: "/transactions",
          icon: Receipt,
        },
        {
          title: "SaaS Settings",
          url: "/settings",
          icon: Settings,
        },
        {
          title: "Global Audit Logs",
          url: "/audit-logs",
          icon: ClipboardList,
        }
      ];
    }

    if (userRole === 'OWNER') {
      return [
        {
          title: "Dashboard",
          url: "/",
          icon: LayoutDashboard,
        },
        {
          title: "Akademik",
          url: "#",
          icon: GraduationCap,
          isActive: true,
          items: [
            {
              title: "Santri & Wali",
              url: "/santri",
            },
            {
              title: "Kelas & Akademik",
              url: "/kelas",
            }
          ]
        },
        {
          title: "Keuangan",
          url: "#",
          icon: Receipt,
          items: [
            {
              title: "Tarif & Tagihan",
              url: "/tagihan",
            },
            {
              title: "Transaksi & Laporan",
              url: "/transaksi",
            },
            {
              title: "Rekening & Gateway",
              url: "/rekening",
            }
          ]
        },
        {
          title: "Administrasi",
          url: "#",
          icon: UserCog,
          items: [
            {
              title: "Kelola Staf Admin",
              url: "/staf",
            },
            {
              title: "Audit Trail Log",
              url: "/audit-logs",
            }
          ]
        }
      ];
    }

    if (userRole === 'ADMIN') {
      return [
        {
          title: "Dashboard",
          url: "/",
          icon: LayoutDashboard,
        },
        {
          title: "Akademik",
          url: "#",
          icon: GraduationCap,
          isActive: true,
          items: [
            {
              title: "Santri & Wali",
              url: "/santri",
            },
            {
              title: "Kelas & Akademik",
              url: "/kelas",
            }
          ]
        },
        {
          title: "Keuangan",
          url: "#",
          icon: Receipt,
          items: [
            {
              title: "Tarif & Tagihan",
              url: "/tagihan",
            },
            {
              title: "Transaksi & Laporan",
              url: "/transaksi",
            }
          ]
        },
        {
          title: "Administrasi",
          url: "#",
          icon: ClipboardList,
          items: [
            {
              title: "Audit Trail Log",
              url: "/audit-logs",
            }
          ]
        }
      ];
    }

    return [];
  };

  const menuItems = getNavMain();
  const displayRoleText = userRole === 'SUPERADMIN' ? 'SaaS Owner' : userRole === 'OWNER' ? 'Pesantren Owner' : 'Pesantren Admin';

  return (
    <Sidebar
      className="top-[var(--header-height)] !h-[calc(100svh-var(--header-height))]"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">SaaS Pesantren</span>
                  <span className="truncate text-xs">{displayRoleText}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.length > 0 && <NavMain items={menuItems} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ name, email, avatar: "" }} onLogout={onLogout} />
      </SidebarFooter>
    </Sidebar>
  )
}
