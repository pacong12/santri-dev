'use client';

import React from 'react';
import { useAuth } from '../lib/context/auth-context';
import { SidebarTrigger, Separator } from '@org/ui';

export const Navbar = () => {
  const { memberships, activeTenantId, switchTenant } = useAuth();

  return (
    <header className="bg-zinc-900 border-b border-zinc-800 text-white h-16 flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-zinc-400 hover:text-white hover:bg-zinc-800 h-8 w-8" />
        <Separator orientation="vertical" className="h-4 bg-zinc-800 mr-2" />

        {memberships.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500 font-medium">Tenant:</span>
            <select
              value={activeTenantId || ''}
              onChange={(e) => switchTenant(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg text-xs py-1.5 px-3 focus:outline-none focus:border-indigo-500 text-zinc-200 font-medium cursor-pointer"
            >
              {memberships.map((m) => (
                <option key={m.tenantId} value={m.tenantId} className="bg-zinc-950 text-white">
                  {m.tenant?.name || 'Unknown'}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Right side is kept clean as user profile & logout are now in the Sidebar */}
      </div>
    </header>
  );
};
