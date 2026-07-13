'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@org/ui';
import { CreditCard, Filter, AlertCircle, Download } from 'lucide-react';
import { fetchApi } from '../../../lib/api-client';

// Modular Components
import { TransactionTable } from './components/transaction-table';

interface TransaksiItem {
  id: string;
  santriId: string;
  tagihanId: string | null;
  orderId: string;
  amount: number | string;
  platformFee: number | string;
  gatewayFee: number | string;
  netAmount: number | string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'EXPIRED';
  paymentMethod: string | null;
  gateway: string | null;
  paidAt: string | null;
  createdAt: string;
}

export default function TransaksiPage() {
  const [transactions, setTransactions] = useState<TransaksiItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'PENDING' | 'FAILED'>('ALL');

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetchApi<TransaksiItem[]>('/payments');
      if (res.success && res.data) {
        setTransactions(res.data);
      }
    } catch (e: any) {
      setError(e.message || 'Gagal memuat mutasi transaksi.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const filteredTransactions = transactions.filter((t) => {
    return statusFilter === 'ALL' || t.status === statusFilter;
  });

  // Summarize metrics
  const totalVolume = filteredTransactions
    .filter(t => t.status === 'SUCCESS')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalNet = filteredTransactions
    .filter(t => t.status === 'SUCCESS')
    .reduce((sum, t) => sum + Number(t.netAmount), 0);

  const totalFees = filteredTransactions
    .filter(t => t.status === 'SUCCESS')
    .reduce((sum, t) => sum + Number(t.platformFee) + Number(t.gatewayFee), 0);

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent flex items-center gap-2">
            <CreditCard className="size-8 text-indigo-400" />
            Laporan & Mutasi Transaksi
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Monitoring kas masuk real-time, potongan biaya SaaS, dan rincian nominal bersih yang masuk ke rekening sekolah.
          </p>
        </div>

        <Button variant="outline" className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 gap-2 self-start md:self-auto">
          <Download className="size-4" />
          Ekspor CSV
        </Button>
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

      {/* Metrics Summary Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-xl space-y-2">
          <p className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Total Pembayaran Santri (Gross)</p>
          <p className="text-2xl font-bold text-zinc-100 font-mono">Rp {totalVolume.toLocaleString('id-ID')}</p>
          <p className="text-[10px] text-zinc-500">Volume akumulasi dari transaksi berstatus Sukses</p>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-xl space-y-2">
          <p className="text-zinc-400 text-xs uppercase tracking-wider font-semibold text-indigo-400">Total Potongan (Fees)</p>
          <p className="text-2xl font-bold text-zinc-100 font-mono">Rp {totalFees.toLocaleString('id-ID')}</p>
          <p className="text-[10px] text-zinc-500">Gabungan platform fee & gateway fee ditanggung santri</p>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-xl space-y-2 border-emerald-500/20">
          <p className="text-zinc-400 text-xs uppercase tracking-wider font-semibold text-emerald-400">Penerimaan Bersih Pesantren</p>
          <p className="text-2xl font-bold text-zinc-100 font-mono text-emerald-400">Rp {totalNet.toLocaleString('id-ID')}</p>
          <p className="text-[10px] text-zinc-500">Diterima utuh tanpa potongan biaya tambahan</p>
        </div>
      </div>

      {/* Filters & Actions Bar */}
      <div className="flex items-center justify-between bg-zinc-900/20 border border-zinc-800/80 rounded-xl p-4">
        <span className="text-zinc-400 text-sm">Daftar Mutasi Transaksi</span>
        <div className="flex items-center gap-2">
          <Filter className="size-3.5 text-zinc-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white"
          >
            <option value="ALL">Semua Status</option>
            <option value="SUCCESS">Sukses</option>
            <option value="PENDING">Menunggu Pembayaran</option>
            <option value="FAILED">Gagal / Kadaluwarsa</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <TransactionTable transactions={filteredTransactions} isLoading={isLoading} />
    </div>
  );
}
