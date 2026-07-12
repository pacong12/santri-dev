'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@org/ui';
import {
  School,
  TrendingUp,
  Activity,
  DollarSign,
  ArrowUpRight,
  Settings
} from 'lucide-react';
import { fetchApi } from '../../../lib/api-client';

interface DashboardStats {
  totalTenants: number;
  activeTenants: number;
  transactionsCount: number;
  totalVolume: number;
  totalPlatformFees: number;
  recentTenants: Array<{
    id: string;
    name: string;
    code: string;
    status: string;
    createdAt: string;
  }>;
  recentTransactions: Array<{
    id: string;
    tenantName: string;
    santriName: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
}

export default function SuperadminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const res = await fetchApi<DashboardStats>('/superadmin/dashboard-stats');
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (e: any) {
        setError(e.message || 'Gagal memuat data statistik.');
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">
            Dashboard Superadmin
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Selamat datang di Panel Utama Pengelola SaaS Pembayaran Pesantren.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-zinc-900/30 border border-zinc-800 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 mt-4">
          <div className="h-64 bg-zinc-900/30 border border-zinc-800 rounded-xl animate-pulse" />
          <div className="h-64 bg-zinc-900/30 border border-zinc-800 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">
          Dashboard Superadmin
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Selamat datang di Panel Utama Pengelola SaaS Pembayaran Pesantren.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-zinc-900/50 backdrop-blur-md border-zinc-800 text-white shadow-xl hover:border-indigo-500/50 transition duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">
              Total Pesantren
            </CardDescription>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <School className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <CardTitle className="text-2xl font-bold text-zinc-100">
              {stats?.totalTenants || 0} Tenant
            </CardTitle>
            <p className="text-[10px] text-zinc-500 mt-1 font-mono">
              {stats?.totalTenants ? Math.round(((stats.activeTenants / stats.totalTenants) * 100)) : 0}% Pesantren Aktif
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 backdrop-blur-md border-zinc-800 text-white shadow-xl hover:border-emerald-500/50 transition duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">
              Transaksi Platform
            </CardDescription>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <CardTitle className="text-2xl font-bold text-zinc-100">
              Rp {(stats?.totalVolume || 0).toLocaleString('id-ID')}
            </CardTitle>
            <p className="text-[10px] text-zinc-500 mt-1 font-mono">
              Total volume pembayaran santri ({stats?.transactionsCount || 0} transaksi)
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 backdrop-blur-md border-zinc-800 text-white shadow-xl hover:border-cyan-500/50 transition duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">
              SaaS Fee Terkumpul
            </CardDescription>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <TrendingUp className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <CardTitle className="text-2xl font-bold text-zinc-100">
              Rp {(stats?.totalPlatformFees || 0).toLocaleString('id-ID')}
            </CardTitle>
            <p className="text-[10px] text-zinc-500 mt-1 font-mono font-medium">Platform revenue share</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 backdrop-blur-md border-zinc-800 text-white shadow-xl hover:border-emerald-500/50 transition duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">
              Status Sistem
            </CardDescription>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Activity className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <CardTitle className="text-2xl font-bold text-emerald-400">Normal</CardTitle>
            <p className="text-[10px] text-zinc-500 mt-1 font-mono">Uptime server 99.9%</p>
          </CardContent>
        </Card>
      </div>

      {/* Core Modules Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-zinc-900/40 border-zinc-800 text-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-zinc-200">
              Pintasan Pengelola SaaS
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Akses cepat pengaturan global administrasi platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <a
              href="/tenants"
              className="flex items-center justify-between p-4 bg-zinc-950/40 border border-zinc-800/80 rounded-xl hover:border-indigo-500/40 hover:bg-zinc-950/80 transition duration-200 cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-indigo-400 group-hover:border-indigo-500/30">
                  <School className="size-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-zinc-300 group-hover:text-white transition">Daftar Tenant Pesantren</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">Kelola keaktifan dan limitasi modul pesantren.</p>
                </div>
              </div>
              <ArrowUpRight className="size-4 text-zinc-500 group-hover:text-indigo-400 transition" />
            </a>
            <a
              href="/settings"
              className="flex items-center justify-between p-4 bg-zinc-950/40 border border-zinc-800/80 rounded-xl hover:border-indigo-500/40 hover:bg-zinc-950/80 transition duration-200 cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-indigo-400 group-hover:border-indigo-500/30">
                  <Settings className="size-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-zinc-300 group-hover:text-white transition">Skema SaaS & Platform Fee</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">Atur bagi hasil flat fee transaksi per pembayaran.</p>
                </div>
              </div>
              <ArrowUpRight className="size-4 text-zinc-500 group-hover:text-indigo-400 transition" />
            </a>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/40 border-zinc-800 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-zinc-200">
                Aksi Pembayaran Terkini
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Status transaksi real-time di seluruh tenant.
              </CardDescription>
            </div>
            <a href="/audit-logs" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition">
              Lihat Audit Logs <ArrowUpRight className="size-3" />
            </a>
          </CardHeader>
          <CardContent className="space-y-4 font-mono text-xs">
            {stats?.recentTransactions && stats.recentTransactions.length > 0 ? (
              stats.recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-start justify-between p-3 bg-zinc-950/30 border border-zinc-800/60 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-indigo-400 font-semibold">
                      [{new Date(tx.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}]
                    </span>
                    <div className="space-y-0.5 font-sans">
                      <p className="text-zinc-300 text-xs">
                        Pembayaran Santri <span className="font-semibold text-zinc-200">{tx.santriName}</span> ({tx.tenantName})
                      </p>
                      <p className="text-zinc-500 text-[10px]">
                        Status: <span className={tx.status === 'SUCCESS' ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>{tx.status}</span>
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-zinc-300 text-[11px] font-semibold">
                    Rp {tx.amount.toLocaleString('id-ID')}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-zinc-500 text-center py-6 font-sans text-xs">Belum ada transaksi terekam.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
