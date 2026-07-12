'use client';

import React, { useEffect } from 'react';
import { PageLayout } from '../components/page-layout';
import { useAuth } from '../lib/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@org/ui';
import {
  Users,
  Activity,
  DollarSign,
  ShieldAlert,
  CheckCircle,
  ArrowUpRight
} from 'lucide-react';

export default function Index() {
  const { user, activeRole, activeTenantId, memberships } = useAuth();
  const router = useRouter();
  
  const currentTenant = memberships.find(m => m.tenantId === activeTenantId)?.tenant;
  const sidebarRole = user?.platformRole === 'SUPERADMIN' ? 'SUPERADMIN' : (activeRole as 'OWNER' | 'ADMIN' | 'SANTRI' | null);

  useEffect(() => {
    if (sidebarRole === 'SUPERADMIN') {
      router.push('/superadmin');
    }
  }, [sidebarRole, router]);

  // Render Superadmin View
  if (sidebarRole === 'SUPERADMIN') {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-zinc-500 text-xs font-medium">Mengarahkan ke Dashboard Superadmin...</p>
        </div>
      </div>
    );
  }



  // Render Owner View
  if (sidebarRole === 'OWNER') {
    return (
      <PageLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">
              {currentTenant?.name || 'Dashboard Owner'}
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Selamat datang di Panel Manajemen Eksekutif Pesantren.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="bg-zinc-900/50 backdrop-blur-md border-zinc-800 text-white shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                  Santri Terdaftar
                </CardDescription>
                <Users className="size-4 text-indigo-400" />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-2xl font-bold text-zinc-100">340 Santri</CardTitle>
                <p className="text-[10px] text-zinc-500 mt-1 font-mono">Terbagi di 12 kelas aktif</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 backdrop-blur-md border-zinc-800 text-white shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                  Pendapatan Bulan Ini
                </CardDescription>
                <DollarSign className="size-4 text-emerald-400" />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-2xl font-bold text-zinc-100">Rp 112.500.000</CardTitle>
                <p className="text-[10px] text-zinc-500 mt-1 font-mono">Berdasarkan SPP & iuran bulanan</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 backdrop-blur-md border-zinc-800 text-white shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                  Tagihan Belum Lunas
                </CardDescription>
                <ShieldAlert className="size-4 text-rose-400" />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-2xl font-bold text-zinc-100">Rp 18.200.000</CardTitle>
                <p className="text-[10px] text-zinc-500 mt-1 font-mono">Perlu follow-up pengiriman tagihan</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 backdrop-blur-md border-zinc-800 text-white shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                  Metode Pembayaran
                </CardDescription>
                <CheckCircle className="size-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-2xl font-bold text-zinc-100">Virtual Account</CardTitle>
                <p className="text-[10px] text-zinc-500 mt-1 font-mono">Terintegrasi Gateway</p>
              </CardContent>
            </Card>
          </div>

          {/* Core Modules Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-zinc-900/40 border-zinc-800 text-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-zinc-200">
                  Menu Administrasi Owner
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Modul kelola operasional dan otorisasi sturuktur keuangan.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <a href="/rekening" className="flex items-center justify-between p-4 bg-zinc-950/40 border border-zinc-800/80 rounded-xl hover:border-zinc-700 transition duration-200 cursor-pointer">
                  <div>
                    <h4 className="font-semibold text-sm text-zinc-300">Pengaturan Rekening & Gateway</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">Konfigurasi akun pencairan dana pesantren.</p>
                  </div>
                  <ArrowUpRight className="size-4 text-zinc-500" />
                </a>
                <a href="/staf" className="flex items-center justify-between p-4 bg-zinc-950/40 border border-zinc-800/80 rounded-xl hover:border-zinc-700 transition duration-200 cursor-pointer">
                  <div>
                    <h4 className="font-semibold text-sm text-zinc-300">Kelola Staf Administrasi</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">Tambah dan pantau hak akses admin pengelola harian.</p>
                  </div>
                  <ArrowUpRight className="size-4 text-zinc-500" />
                </a>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/40 border-zinc-800 text-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-zinc-200">
                  Mutasi Transaksi Terbaru
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Transaksi pembayaran tagihan santri terverifikasi sistem.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 font-mono text-xs">
                <div className="flex items-start justify-between text-zinc-400">
                  <span>Ahmad Fauzi - SPP Juli 2026</span>
                  <span className="text-emerald-400 font-semibold">Rp 350.000 [LUNAS]</span>
                </div>
                <div className="flex items-start justify-between text-zinc-400">
                  <span>Zahra Aulia - Uang Pangkal</span>
                  <span className="text-emerald-400 font-semibold">Rp 1.500.000 [LUNAS]</span>
                </div>
                <div className="flex items-start justify-between text-zinc-400">
                  <span>M. Yusuf - Uang Makan</span>
                  <span className="text-emerald-400 font-semibold">Rp 250.000 [LUNAS]</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Render Admin View (default / admin role fallback)
  return (
    <PageLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">
            {currentTenant?.name || 'Dashboard Admin'}
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Selamat datang di Panel Operasional Harian Administrasi Keuangan.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="bg-zinc-900/50 backdrop-blur-md border-zinc-800 text-white shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                Santri Aktif
              </CardDescription>
              <Users className="size-4 text-indigo-400" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-2xl font-bold text-zinc-100">340 Santri</CardTitle>
              <p className="text-[10px] text-zinc-500 mt-1 font-mono">Data terverifikasi aktif</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 backdrop-blur-md border-zinc-800 text-white shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                Tagihan Terbayar
              </CardDescription>
              <CheckCircle className="size-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-2xl font-bold text-zinc-100">285 Tagihan</CardTitle>
              <p className="text-[10px] text-zinc-500 mt-1 font-mono">Pembayaran bulan berjalan</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 backdrop-blur-md border-zinc-800 text-white shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                Tagihan Tertunggak
              </CardDescription>
              <ShieldAlert className="size-4 text-rose-400" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-2xl font-bold text-zinc-100">55 Tagihan</CardTitle>
              <p className="text-[10px] text-zinc-500 mt-1 font-mono">Belum lunas terbayar</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 backdrop-blur-md border-zinc-800 text-white shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                WhatsApp Gateway
              </CardDescription>
              <Activity className="size-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-2xl font-bold text-emerald-400">Tersambung</CardTitle>
              <p className="text-[10px] text-zinc-500 mt-1 font-mono">Koneksi API bot notifikasi</p>
            </CardContent>
          </Card>
        </div>

        {/* Core Modules Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-zinc-900/40 border-zinc-800 text-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-zinc-200">
                Pekerjaan Harian Admin
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Aksi dan pencatatan kas iuran bulanan santri.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <a href="/santri" className="flex items-center justify-between p-4 bg-zinc-950/40 border border-zinc-800/80 rounded-xl hover:border-zinc-700 transition duration-200 cursor-pointer">
                <div>
                  <h4 className="font-semibold text-sm text-zinc-300">Pendaftaran Data Santri & Wali</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">Kelola profil siswa baru dan data wali murid.</p>
                </div>
                <ArrowUpRight className="size-4 text-zinc-500" />
              </a>
              <a href="/tagihan" className="flex items-center justify-between p-4 bg-zinc-950/40 border border-zinc-800/80 rounded-xl hover:border-zinc-700 transition duration-200 cursor-pointer">
                <div>
                  <h4 className="font-semibold text-sm text-zinc-300">Pembuatan Tagihan SPP Baru</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">Terbitkan tagihan baru bulanan secara otomatis.</p>
                </div>
                <ArrowUpRight className="size-4 text-zinc-500" />
              </a>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/40 border-zinc-800 text-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-zinc-200">
                Status Pengiriman WhatsApp Remind
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Riwayat pesan pemberitahuan tagihan dan tanda bayar lunas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 font-mono text-xs">
              <div className="flex items-start gap-2 text-zinc-400">
                <span className="text-emerald-500">✓</span>
                <span>Kirim reminder tagihan Kelas VII-A (55 Pesan Sukses)</span>
              </div>
              <div className="flex items-start gap-2 text-zinc-400">
                <span className="text-emerald-500">✓</span>
                <span>Tanda Terima Pembayaran - Ahmad Yani (Sukses Terkirim)</span>
              </div>
              <div className="flex items-start gap-2 text-zinc-400">
                <span className="text-emerald-500">✓</span>
                <span>Tanda Terima Pembayaran - Zahra Aulia (Sukses Terkirim)</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
