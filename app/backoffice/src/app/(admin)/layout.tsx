'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../../lib/context/auth-context';
import { useRouter } from 'next/navigation';
import { SidebarProvider, AppSidebar, SidebarInset, SiteHeader } from '@org/ui';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user, activeRole, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/auth');
      } else if (activeRole !== 'OWNER' && activeRole !== 'ADMIN') {
        if (user?.platformRole === 'SUPERADMIN') {
          router.push('/superadmin');
        } else {
          router.push('/auth');
        }
      }
    }
  }, [isLoading, isAuthenticated, activeRole, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-zinc-500 text-xs font-medium">Memuat data sesi...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (activeRole !== 'OWNER' && activeRole !== 'ADMIN')) {
    return null;
  }

  return (
    <div className="[--header-height:3.5rem] min-h-screen bg-zinc-950 text-white flex flex-col font-sans w-full">
      <SidebarProvider className="flex flex-col flex-1">
        <SiteHeader />
        <div className="flex flex-1 min-h-0">
          <AppSidebar
            userRole={activeRole as 'OWNER' | 'ADMIN'}
            name={user?.name || user?.username || ''}
            email={user?.email || ''}
            onLogout={handleLogout}
          />
          <SidebarInset className="bg-transparent flex-1 overflow-x-hidden">
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
