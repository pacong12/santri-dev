'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../lib/context/auth-context';
import { useRouter } from 'next/navigation';
import { Navbar } from './navbar';

export const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isLoading, isAuthenticated, router]);

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

  if (!isAuthenticated) {
    return null; // Prevents flashing the dashboard before redirecting
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};
