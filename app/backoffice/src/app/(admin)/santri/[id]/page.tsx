'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@org/ui';
import { ChevronLeft, Users, AlertCircle } from 'lucide-react';
import { fetchApi } from '../../../../lib/api-client';

// Modular Components
import { SantriProfileCard } from './components/santri-profile-card';
import { ActiveBillingTable } from './components/active-billing-table';
import { ClassHistoryList } from './components/class-history-list';
import { CancelBillingDialog } from '../../tagihan/components/cancel-billing-dialog';

interface KelasData {
  id: string;
  name: string;
}

interface RiwayatKelasItem {
  id: string;
  kelasLamaId: string | null;
  kelasBaruId: string;
  tanggal: string;
}

interface SantriDetail {
  id: string;
  nis: string;
  nama: string;
  kelasId: string;
  namaBapak: string | null;
  namaIbu: string | null;
  alamat: string | null;
  userId: string | null;
  kelas: KelasData | null;
  riwayatKelas: RiwayatKelasItem[];
}

interface TagihanItem {
  id: string;
  nama: string;
  amount: number | string;
  periode: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  dueDate: string;
}

export default function SantriDetailPage() {
  const params = useParams();
  const router = useRouter();
  const santriId = params.id as string;

  const [santri, setSantri] = useState<SantriDetail | null>(null);
  const [bills, setBills] = useState<TagihanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBillLoading, setIsBillLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cancel dialog state
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [cancelBillId, setCancelBillId] = useState<string | null>(null);

  const loadSantri = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetchApi<SantriDetail>(`/santri/${santriId}`);
      if (res.success && res.data) {
        setSantri(res.data);
      }
    } catch (e: any) {
      setError(e.message || 'Gagal memuat data santri.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadBills = async () => {
    try {
      setIsBillLoading(true);
      const res = await fetchApi<TagihanItem[]>(`/tagihan/active/${santriId}`);
      if (res.success && res.data) {
        setBills(res.data);
      }
    } catch {
      // Tagihan mungkin kosong — tidak error fatal
    } finally {
      setIsBillLoading(false);
    }
  };

  useEffect(() => {
    loadSantri();
    loadBills();
  }, [santriId]);

  const handleCancelClick = (billId: string) => {
    setCancelBillId(billId);
    setIsCancelOpen(true);
  };

  const handleCancelSuccess = (billId: string) => {
    setBills((prev) =>
      prev.map((b) => (b.id === billId ? { ...b, status: 'CANCELLED' as const } : b))
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-zinc-500 text-sm">Memuat profil santri...</div>
      </div>
    );
  }

  if (error || !santri) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="size-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold">Santri Tidak Ditemukan</h4>
            <p className="text-sm mt-0.5">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* Back navigation + Header */}
      <div className="flex flex-col gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 w-fit gap-1.5"
        >
          <ChevronLeft className="size-4" />
          Kembali ke Direktori Santri
        </Button>

        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <Users className="size-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">
              Profil Santri
            </h1>
            <p className="text-zinc-500 text-xs mt-0.5">NIS: {santri.nis}</p>
          </div>
        </div>
      </div>

      {/* Main content — 2 column layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: Profile card */}
        <div className="lg:col-span-1">
          <SantriProfileCard
            nis={santri.nis}
            nama={santri.nama}
            kelasNama={santri.kelas?.name || santri.kelasId}
            namaBapak={santri.namaBapak}
            namaIbu={santri.namaIbu}
            alamat={santri.alamat}
            userId={santri.userId}
          />
        </div>

        {/* Right column: Billing & History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tagihan */}
          <ActiveBillingTable
            bills={bills}
            isLoading={isBillLoading}
            onCancelClick={handleCancelClick}
          />

          {/* Riwayat Kelas */}
          <ClassHistoryList
            riwayat={santri.riwayatKelas}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Cancel Dialog */}
      <CancelBillingDialog
        isOpen={isCancelOpen}
        onOpenChange={setIsCancelOpen}
        billId={cancelBillId}
        onSuccess={handleCancelSuccess}
      />
    </div>
  );
}
