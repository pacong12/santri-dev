'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/context/auth-context';
import { ShieldAlert, AlertCircle, UserCog } from 'lucide-react';
import { fetchApi } from '../../../lib/api-client';

// Modular Components
import { InviteStafDialog } from './components/invite-staf-dialog';
import { StafTable } from './components/staf-table';

interface StafUser {
  id: string;
  username: string;
  email: string;
  name: string | null;
}

interface StafItem {
  id: string;
  userId: string;
  role: string;
  createdAt: string;
  user: StafUser;
}

export default function StafPage() {
  const { activeRole } = useAuth();
  const [stafList, setStafList] = useState<StafItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStaf = async () => {
    if (activeRole !== 'OWNER') {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetchApi<StafItem[]>('/tenant/staf');
      if (res.success && res.data) {
        setStafList(res.data);
      }
    } catch (e: any) {
      setError(e.message || 'Gagal memuat data staf admin.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStaf();
  }, [activeRole]);

  const handleRemove = async (userId: string) => {
    if (!confirm('Apakah Anda yakin ingin mencabut hak akses administrator untuk staf ini?')) return;
    try {
      const res = await fetchApi<StafItem>(`/tenant/staf/${userId}`, {
        method: 'DELETE',
      });
      if (res.success) {
        setStafList((prev) => prev.filter((s) => s.userId !== userId));
      }
    } catch (e: any) {
      alert(e.message || 'Gagal menghapus staf admin.');
    }
  };

  if (activeRole !== 'OWNER') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="bg-rose-500/5 border border-rose-500/10 p-8 rounded-2xl max-w-md text-center space-y-4 shadow-xl">
          <div className="size-12 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto text-rose-500">
            <ShieldAlert className="size-6" />
          </div>
          <h2 className="text-xl font-bold text-zinc-100">Akses Terbatas</h2>
          <p className="text-zinc-400 text-sm">
            Halaman manajemen staf hanya dapat diakses oleh pemilik pesantren (**OWNER**).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent flex items-center gap-2">
            <UserCog className="size-8 text-indigo-400" />
            Kelola Staf Administrasi
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Undang petugas baru untuk membantu operasional keuangan harian pesantren.
          </p>
        </div>

        <InviteStafDialog onSuccess={loadStaf} />
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="size-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold">Terjadi Kesalahan</h4>
            <p className="text-sm mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Staf Table */}
      <StafTable stafList={stafList} isLoading={isLoading} onRemove={handleRemove} />
    </div>
  );
}
