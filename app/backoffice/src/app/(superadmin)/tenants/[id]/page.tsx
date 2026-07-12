'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge } from '@org/ui';
import {
  ArrowLeft,
  School,
  User,
  Landmark,
  Shield,
  MapPin,
  Phone,
  Mail,
  TrendingUp,
  CreditCard,
  Calendar,
  Layers
} from 'lucide-react';
import { fetchApi } from '../../../../lib/api-client';

interface TenantDetailData {
  tenant: {
    id: string;
    name: string;
    code: string;
    status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
    phone: string | null;
    emailOfficial: string | null;
    address: string | null;
    bankName: string | null;
    bankAccountNumber: string | null;
    bankAccountName: string | null;
    gatewayAccountId: string | null;
    defaultDueDays: number;
    createdAt: string;
  };
  stats: {
    santriCount: number;
    kelasCount: number;
    tagihanCount: number;
    totalVolume: number;
    totalPlatformFees: number;
  };
  auditLogs: Array<{
    id: string;
    action: string;
    details: string;
    createdAt: string;
    actorName: string;
  }>;
}

export default function TenantDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [data, setData] = useState<TenantDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const loadTenantDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetchApi<TenantDetailData>(`/superadmin/tenants/${id}`);
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (e: any) {
        setError(e.message || 'Gagal memuat informasi detail pesantren.');
      } finally {
        setIsLoading(false);
      }
    };
    loadTenantDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
        <div className="h-6 w-24 bg-zinc-800 rounded animate-pulse" />
        <div className="space-y-2 mt-2">
          <div className="h-8 w-64 bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 w-40 bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="grid gap-4 md:grid-cols-4 mt-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-zinc-900/30 border border-zinc-800 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-3 mt-4">
          <div className="md:col-span-2 h-64 bg-zinc-900/30 border border-zinc-800 rounded-xl animate-pulse" />
          <div className="h-64 bg-zinc-900/30 border border-zinc-800 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 max-w-7xl mx-auto w-full">
        <Button variant="outline" className="w-fit border-zinc-800 text-zinc-400 hover:text-white" onClick={() => window.history.back()}>
          <ArrowLeft className="size-4 mr-2" /> Kembali
        </Button>
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl mt-4 text-center">
          <h3 className="font-bold text-lg">Kesalahan Memuat Halaman</h3>
          <p className="text-sm text-zinc-400 mt-2">{error || 'Pesantren tidak ditemukan.'}</p>
        </div>
      </div>
    );
  }

  const { tenant, stats, auditLogs } = data;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
      {/* Header Navigation */}
      <div>
        <a
          href="/tenants"
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-indigo-400 font-medium transition w-fit mb-2 cursor-pointer"
        >
          <ArrowLeft className="size-3.5" /> Kembali ke Daftar Pesantren
        </a>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">
                {tenant.name}
              </h1>
              {tenant.status === 'ACTIVE' && (
                <Badge className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-[10px] font-bold">
                  ACTIVE
                </Badge>
              )}
              {tenant.status === 'SUSPENDED' && (
                <Badge className="bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-[10px] font-bold">
                  SUSPENDED
                </Badge>
              )}
              {tenant.status === 'INACTIVE' && (
                <Badge className="bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-800 text-[10px] font-bold">
                  INACTIVE
                </Badge>
              )}
            </div>
            <p className="font-mono text-zinc-500 text-xs select-all">
              ID Tenant: {tenant.id} • Domain: {tenant.code}.santri.dev
            </p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-zinc-900/40 border-zinc-800 text-white shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Total Santri</CardDescription>
            <div className="p-1.5 rounded bg-zinc-800 text-zinc-400">
              <User className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-1">
            <CardTitle className="text-2xl font-bold text-zinc-200">{stats.santriCount} Anak</CardTitle>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/40 border-zinc-800 text-white shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Jumlah Kelas</CardDescription>
            <div className="p-1.5 rounded bg-zinc-800 text-zinc-400">
              <Layers className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-1">
            <CardTitle className="text-2xl font-bold text-zinc-200">{stats.kelasCount} Rombel</CardTitle>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/40 border-zinc-800 text-white shadow hover:border-emerald-500/40 transition">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Volume Sukses</CardDescription>
            <div className="p-1.5 rounded bg-zinc-800 text-zinc-400">
              <TrendingUp className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-1">
            <CardTitle className="text-2xl font-bold text-zinc-200">
              Rp {stats.totalVolume.toLocaleString('id-ID')}
            </CardTitle>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/40 border-zinc-800 text-white shadow hover:border-cyan-500/40 transition">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Platform Revenue</CardDescription>
            <div className="p-1.5 rounded bg-zinc-800 text-zinc-400">
              <CreditCard className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-1">
            <CardTitle className="text-2xl font-bold text-zinc-200">
              Rp {stats.totalPlatformFees.toLocaleString('id-ID')}
            </CardTitle>
          </CardContent>
        </Card>
      </div>

      {/* Main grids */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Profil Pesantren & Rekening */}
        <div className="md:col-span-2 space-y-4">
          <Card className="bg-zinc-900/40 border-zinc-800 text-white">
            <CardHeader className="border-b border-zinc-800/60">
              <CardTitle className="text-base font-bold text-zinc-200 flex items-center gap-2">
                <School className="size-4.5 text-indigo-400" />
                Informasi Kelembagaan Pesantren
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Nama Resmi</span>
                  <p className="text-sm font-semibold text-zinc-200">{tenant.name}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Kode Slug Domain</span>
                  <p className="text-sm font-semibold font-mono text-indigo-400">{tenant.code}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-zinc-800/40 pt-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">No Telepon</span>
                  <p className="text-sm font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Phone className="size-3.5 text-zinc-500" />
                    {tenant.phone || '-'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Email Official</span>
                  <p className="text-sm font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Mail className="size-3.5 text-zinc-500" />
                    {tenant.emailOfficial || '-'}
                  </p>
                </div>
              </div>

              <div className="space-y-1 border-t border-zinc-800/40 pt-4">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="size-3" /> Alamat Lengkap
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                  {tenant.address || 'Belum diatur.'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/40 border-zinc-800 text-white">
            <CardHeader className="border-b border-zinc-800/60">
              <CardTitle className="text-base font-bold text-zinc-200 flex items-center gap-2">
                <Landmark className="size-4.5 text-indigo-400" />
                Informasi Rekening & Payment Gateway
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Bank Penyalur</span>
                  <p className="text-sm font-semibold text-zinc-200">{tenant.bankName || '-'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Atas Nama Rekening</span>
                  <p className="text-sm font-semibold text-zinc-200">{tenant.bankAccountName || '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-zinc-800/40 pt-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Nomor Rekening Bank</span>
                  <p className="text-sm font-semibold font-mono text-zinc-300">{tenant.bankAccountNumber || '-'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Midtrans Sub-Merchant ID</span>
                  <p className="text-sm font-semibold font-mono text-indigo-400 select-all">
                    {tenant.gatewayAccountId || 'Belum diatur (Split Payment mati).'}
                  </p>
                </div>
              </div>

              <div className="space-y-1 border-t border-zinc-800/40 pt-4">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Batas Jatuh Tempo Tagihan</span>
                <p className="text-xs text-zinc-300 leading-normal font-medium">
                  {tenant.defaultDueDays} Hari setelah invoice dibuat default.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audit Log Trail */}
        <div>
          <Card className="bg-zinc-900/40 border-zinc-800 text-white h-full">
            <CardHeader className="border-b border-zinc-800/60 flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-base font-bold text-zinc-200 flex items-center gap-2">
                  <Shield className="size-4.5 text-indigo-400" />
                  Audit Log Khusus
                </CardTitle>
                <CardDescription className="text-zinc-500 text-[10px] mt-0.5">
                  Catatan aktivitas administratif tenant ini.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-4 font-mono text-[11px] space-y-4">
              {auditLogs && auditLogs.length > 0 ? (
                auditLogs.map((log) => (
                  <div key={log.id} className="border-b border-zinc-800/60 pb-3 last:border-0 last:pb-0 space-y-1">
                    <div className="flex justify-between items-center text-zinc-500 text-[10px]">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {new Date(log.createdAt).toLocaleDateString('id-ID')}
                      </span>
                      <span>{new Date(log.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-zinc-300 font-sans text-xs font-semibold mt-0.5">
                      {log.action}
                    </p>
                    <p className="text-zinc-400 font-sans text-[11px] leading-relaxed">
                      {log.details}
                    </p>
                    <p className="text-zinc-600 text-[9px] font-sans">
                      Actor: {log.actorName}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-zinc-600 text-center py-10 font-sans text-xs">Belum ada riwayat aktivitas.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
