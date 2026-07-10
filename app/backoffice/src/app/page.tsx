'use client';

import React from 'react';
import { PageLayout } from '../components/page-layout';
import { useAuth } from '../lib/context/auth-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@org/ui';

export default function Index() {
  const { user, activeRole, activeTenantId, memberships } = useAuth();
  
  const currentTenant = memberships.find(m => m.tenantId === activeTenantId)?.tenant;

  return (
    <PageLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">
            Dashboard Utama
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Selamat datang di panel administrasi keuangan pesantren.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-zinc-900/50 backdrop-blur-md border-zinc-800 text-white">
            <CardHeader className="pb-2">
              <CardDescription className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                Pesantren Aktif
              </CardDescription>
              <CardTitle className="text-xl font-bold text-zinc-100 mt-1">
                {currentTenant?.name || 'Belum Terpilih'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-400 font-mono">ID: {activeTenantId || '-'}</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 backdrop-blur-md border-zinc-800 text-white">
            <CardHeader className="pb-2">
              <CardDescription className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                Peran Pengguna
              </CardDescription>
              <CardTitle className="text-xl font-bold text-zinc-100 mt-1">
                {activeRole || 'SANTRI'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-400 font-mono">Email: {user?.email || '-'}</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 backdrop-blur-md border-zinc-800 text-white">
            <CardHeader className="pb-2">
              <CardDescription className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                Status Koneksi
              </CardDescription>
              <CardTitle className="text-xl font-bold text-emerald-400 mt-1">
                Terhubung (Online)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-400">Tersinkronisasi dengan API Gateway</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-zinc-900/40 border-zinc-800 text-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-zinc-200">
                Menu Administrasi
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Modul-modul kelola sesuai dengan hak akses Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-zinc-950/40 border border-zinc-800/80 rounded-xl hover:border-zinc-700 transition duration-200 cursor-pointer">
                <h4 className="font-semibold text-sm text-zinc-300">Direktori & Data Santri</h4>
                <p className="text-xs text-zinc-500 mt-0.5">Kelola kelas, wali murid, dan entitas data siswa.</p>
              </div>
              <div className="p-4 bg-zinc-950/40 border border-zinc-800/80 rounded-xl hover:border-zinc-700 transition duration-200 cursor-pointer">
                <h4 className="font-semibold text-sm text-zinc-300">Tarif & Tagihan Bulanan (SPP)</h4>
                <p className="text-xs text-zinc-500 mt-0.5">Atur skema penagihan otomatis dan nominal iuran kelas.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/40 border-zinc-800 text-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-zinc-200">
                Aktivitas Finansial Terbaru
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Transaksi pembayaran tagihan santri terverifikasi.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[180px] flex items-center justify-center border border-dashed border-zinc-800 rounded-xl">
              <p className="text-xs text-zinc-500 font-medium">Belum ada transaksi terekam.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
