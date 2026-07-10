'use client';

import React from 'react';
import { useAuth } from '../lib/context/auth-context';
import { Button } from '@org/ui';
import { useRouter } from 'next/navigation';

export const Navbar = () => {
  const { user, memberships, activeTenantId, activeRole, switchTenant, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  return (
    <header className="bg-zinc-900 border-b border-zinc-800 text-white h-16 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-600/10">
            SP
          </div>
          <span className="font-semibold text-lg hidden sm:inline-block tracking-tight bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">
            SaaS Pesantren
          </span>
        </div>

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
        {user && (
          <div className="text-right hidden md:block">
            <p className="text-xs font-semibold text-zinc-200">{user.name || user.username}</p>
            <p className="text-[10px] text-zinc-400">{user.email}</p>
          </div>
        )}

        {activeRole && (
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
            {activeRole}
          </span>
        )}

        <Button
          onClick={handleLogout}
          variant="outline"
          className="border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 hover:text-white rounded-lg text-xs py-1.5 h-auto px-3"
        >
          Keluar
        </Button>
      </div>
    </header>
  );
};
