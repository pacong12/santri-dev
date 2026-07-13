'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@org/ui';
import { ChevronLeft, Receipt, AlertCircle, XCircle } from 'lucide-react';
import { fetchApi } from '../../../../lib/api-client';

// Modular Components
import { BillingDetailCard } from './components/billing-detail-card';
import { PaymentBreakdownCard } from './components/payment-breakdown-card';
import { CancelBillingDialog } from '../components/cancel-billing-dialog';

interface SantriData {
  id: string;
  nama: string;
  nis: string;
  kelasId: string;
}

interface JenisTagihanData {
  id: string;
  name: string;
}

interface TagihanDetail {
  id: string;
  santriId: string;
  jenisTagihanId: string | null;
  tahunAjaranId: string | null;
  nama: string;
  amount: number | string;
  periode: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  dueDate: string;
  createdAt: string;
  santri: SantriData | null;
  jenisTagihan: JenisTagihanData | null;
}

// Platform & gateway fee defaults (configurable via tenant settings)
const PLATFORM_FEE = 1000;
const GATEWAY_FEE = 4000;

export default function TagihanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tagihanId = params.id as string;

  const [tagihan, setTagihan] = useState<TagihanDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cancel dialog
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const loadTagihan = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetchApi<TagihanDetail>(`/tagihan/${tagihanId}`);
      if (res.success && res.data) {
        setTagihan(res.data);
      }
    } catch (e: any) {
      setError(e.message || 'Gagal memuat detail tagihan.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTagihan();
  }, [tagihanId]);

  const handleCancelSuccess = (billId: string) => {
    if (tagihan && tagihan.id === billId) {
      setTagihan((prev) => prev ? { ...prev, status: 'CANCELLED' } : prev);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-zinc-500 text-sm">Memuat detail tagihan...</div>
      </div>
    );
  }

  if (error || !tagihan) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="size-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold">Tagihan Tidak Ditemukan</h4>
            <p className="text-sm mt-0.5">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const baseAmount = Number(tagihan.amount);

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
          Kembali
        </Button>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <Receipt className="size-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">
                Detail Tagihan
              </h1>
              <p className="text-zinc-500 text-xs mt-0.5">{tagihan.nama}</p>
            </div>
          </div>

          {/* Cancel action */}
          {tagihan.status === 'PENDING' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCancelOpen(true)}
              className="border-rose-800/60 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/40 gap-1.5"
            >
              <XCircle className="size-4" />
              Batalkan Tagihan
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Info tagihan */}
        <BillingDetailCard
          id={tagihan.id}
          nama={tagihan.nama}
          periode={tagihan.periode}
          dueDate={tagihan.dueDate}
          createdAt={tagihan.createdAt}
          status={tagihan.status}
          santriNama={tagihan.santri?.nama}
          santriId={tagihan.santri?.id}
          santriNis={tagihan.santri?.nis}
          jenisTagihanNama={tagihan.jenisTagihan?.name}
        />

        {/* Right: Split payment breakdown */}
        <PaymentBreakdownCard
          baseAmount={baseAmount}
          platformFee={PLATFORM_FEE}
          gatewayFee={GATEWAY_FEE}
        />
      </div>

      {/* Cancel Dialog */}
      <CancelBillingDialog
        isOpen={isCancelOpen}
        onOpenChange={setIsCancelOpen}
        billId={tagihan.id}
        onSuccess={handleCancelSuccess}
      />
    </div>
  );
}
