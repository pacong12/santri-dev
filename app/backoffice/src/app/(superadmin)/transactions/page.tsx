'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge, Input, Table, TableHeader, TableBody, TableHead, TableRow, TableCell, Dialog, DialogContent, DialogHeader, DialogTitle } from '@org/ui';
import {
  Search,
  Calendar,
  DollarSign,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  Receipt,
  School,
  User,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Copy,
  Check,
  Eye,
  Info,
  CreditCard
} from 'lucide-react';
import { fetchApi } from '../../../lib/api-client';

interface TransactionItem {
  id: string;
  tenantName: string;
  tenantCode: string;
  santriName: string;
  santriNis: string;
  tagihanName: string;
  amount: number;
  platformFee: number;
  gatewayFee: number;
  netAmount: number;
  orderId: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED';
  paymentMethod: string | null;
  gateway: string | null;
  gatewayReference: string | null;
  gatewayResponse: any | null;
  paidAt: string | null;
  createdAt: string;
}

interface TransactionsData {
  transactions: TransactionItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  totalSuccessVolume: number;
  totalSuccessPlatformFees: number;
}

export default function TransactionsDashboard() {
  const [data, setData] = useState<TransactionsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Pagination states
  const [page, setPage] = useState(1);

  // Payload inspector states
  const [activeResponse, setActiveResponse] = useState<any | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  // Debounce search text
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on new search
    }, 450);
    return () => clearTimeout(timer);
  }, [search]);

  // Load transactions list from api
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetchApi<TransactionsData>(
          `/superadmin/transactions?page=${page}&limit=20&search=${debouncedSearch}&status=${statusFilter}`
        );
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (e: any) {
        setError(e.message || 'Gagal memuat riwayat transaksi.');
      } finally {
        setIsLoading(false);
      }
    };
    loadTransactions();
  }, [page, debouncedSearch, statusFilter]);

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openInspector = (response: any) => {
    setActiveResponse(response);
    setIsInspectorOpen(true);
  };

  if (isLoading && !data) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
        <div className="space-y-1">
          <div className="h-8 w-64 bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 w-40 bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 mt-4">
          <div className="h-24 bg-zinc-900/30 border border-zinc-800 rounded-xl animate-pulse" />
          <div className="h-24 bg-zinc-900/30 border border-zinc-800 rounded-xl animate-pulse" />
        </div>
        <div className="h-64 bg-zinc-900/30 border border-zinc-800 rounded-xl animate-pulse mt-4" />
      </div>
    );
  }

  const transactions = data?.transactions || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;
  const totalSuccessVolume = data?.totalSuccessVolume || 0;
  const totalSuccessPlatformFees = data?.totalSuccessPlatformFees || 0;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">
          Riwayat Transaksi Global
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Pantau seluruh aktivitas pembayaran syahriah dan dana komisi SaaS di semua tenant pesantren.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-zinc-900/50 backdrop-blur-md border-zinc-800 text-white shadow-xl hover:border-emerald-500/30 transition duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">
              Volume Transaksi Sukses
            </CardDescription>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <CardTitle className="text-2xl font-bold text-zinc-100">
              Rp {totalSuccessVolume.toLocaleString('id-ID')}
            </CardTitle>
            <p className="text-[10px] text-zinc-500 mt-1 font-mono">
              Total volume bersih yang diproses di sistem
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 backdrop-blur-md border-zinc-800 text-white shadow-xl hover:border-indigo-500/30 transition duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">
              Flat SaaS Fee Terkumpul
            </CardDescription>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <CardTitle className="text-2xl font-bold text-zinc-100">
              Rp {totalSuccessPlatformFees.toLocaleString('id-ID')}
            </CardTitle>
            <p className="text-[10px] text-zinc-500 mt-1 font-mono font-medium">
              Akumulasi bagi hasil flat fee transaksi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mt-2">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari order ID, nama santri, pesantren..."
              className="pl-9 bg-zinc-900 border-zinc-800 text-white focus-visible:ring-indigo-500/50"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setPage(1);
            }}
            className="bg-zinc-900 border border-zinc-800 rounded-lg text-xs py-2 px-3 focus:outline-none focus:border-indigo-500 text-zinc-300 font-medium cursor-pointer"
          >
            <option value="ALL">Semua Status</option>
            <option value="SUCCESS">SUCCESS (Sukses)</option>
            <option value="PENDING">PENDING (Tertunda)</option>
            <option value="FAILED">FAILED (Gagal)</option>
            <option value="EXPIRED">EXPIRED (Kedaluwarsa)</option>
          </select>
        </div>

        <div className="text-xs text-zinc-500 font-mono font-medium shrink-0">
          Menampilkan {transactions.length} dari {total} data transaksi
        </div>
      </div>

      {/* Table grid */}
      <div className="border border-zinc-800 rounded-xl bg-zinc-900/30 overflow-hidden shadow-lg">
        <Table>
          <TableHeader className="bg-zinc-900/80 border-b border-zinc-800">
            <TableRow className="hover:bg-transparent border-zinc-800">
              <TableHead className="text-zinc-400 font-semibold text-xs py-3.5 w-[50px] text-center">#</TableHead>
              <TableHead className="text-zinc-400 font-semibold text-xs py-3.5">Order ID</TableHead>
              <TableHead className="text-zinc-400 font-semibold text-xs py-3.5">Pesantren</TableHead>
              <TableHead className="text-zinc-400 font-semibold text-xs py-3.5">Santri</TableHead>
              <TableHead className="text-zinc-400 font-semibold text-xs py-3.5">Detail Item</TableHead>
              <TableHead className="text-zinc-400 font-semibold text-xs py-3.5 text-right">Total Bayar</TableHead>
              <TableHead className="text-zinc-400 font-semibold text-xs py-3.5">Split Breakdown</TableHead>
              <TableHead className="text-zinc-400 font-semibold text-xs py-3.5">Status</TableHead>
              <TableHead className="text-zinc-400 font-semibold text-xs py-3.5 w-[140px]">Tanggal & Saluran</TableHead>
              <TableHead className="text-zinc-400 font-semibold text-xs py-3.5 text-right w-[90px]">Gateway Log</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((tx, index) => (
                <TableRow key={tx.id} className="border-b border-zinc-800/65 hover:bg-zinc-900/20 transition duration-150">
                  <TableCell className="font-mono text-zinc-500 text-xs py-4 text-center">
                    {(page - 1) * 20 + index + 1}
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="font-mono text-zinc-200 text-xs flex items-center gap-1.5 select-all">
                      {tx.orderId}
                      <button
                        onClick={() => handleCopy(tx.orderId)}
                        className="text-zinc-600 hover:text-indigo-400 transition cursor-pointer p-0.5"
                        title="Salin Order ID"
                      >
                        {copiedId === tx.orderId ? (
                          <Check className="size-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </button>
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-zinc-200 text-sm flex items-center gap-1">
                        <School className="size-3.5 text-zinc-500" />
                        {tx.tenantName}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono font-medium pl-4.5">
                        Domain: {tx.tenantCode}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-zinc-200 text-xs flex items-center gap-1">
                        <User className="size-3.5 text-zinc-500" />
                        {tx.santriName}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono font-medium pl-4.5">
                        NIS: {tx.santriNis}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-300 text-xs py-4 max-w-[150px] truncate leading-normal font-medium">
                    {tx.tagihanName}
                  </TableCell>
                  <TableCell className="text-right font-mono text-zinc-200 text-xs font-semibold py-4">
                    Rp {tx.amount.toLocaleString('id-ID')}
                  </TableCell>
                  <TableCell className="text-zinc-500 text-[10px] font-mono py-4 space-y-0.5 leading-relaxed">
                    <div className="flex justify-between gap-2">
                      <span>Yayasan (Net):</span>
                      <span className="text-emerald-400 font-medium">Rp {tx.netAmount.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between gap-2 border-t border-zinc-800/40 mt-0.5 pt-0.5">
                      <span>SaaS Fee:</span>
                      <span className="text-indigo-400">Rp {tx.platformFee.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span>Gateway Fee:</span>
                      <span>Rp {tx.gatewayFee.toLocaleString('id-ID')}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    {tx.status === 'SUCCESS' && (
                      <Badge className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 font-bold text-[9px] flex items-center gap-1 w-fit">
                        <CheckCircle2 className="size-3" /> SUCCESS
                      </Badge>
                    )}
                    {tx.status === 'PENDING' && (
                      <Badge className="bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 font-bold text-[9px] flex items-center gap-1 w-fit">
                        <Clock className="size-3" /> PENDING
                      </Badge>
                    )}
                    {tx.status === 'EXPIRED' && (
                      <Badge className="bg-zinc-800 border-zinc-700 text-zinc-500 hover:bg-zinc-800 font-bold text-[9px] flex items-center gap-1 w-fit">
                        <AlertTriangle className="size-3" /> EXPIRED
                      </Badge>
                    )}
                    {tx.status === 'FAILED' && (
                      <Badge className="bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/10 font-bold text-[9px] flex items-center gap-1 w-fit">
                        <AlertTriangle className="size-3" /> FAILED
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-zinc-400 text-xs py-4 space-y-1 font-mono">
                    <div className="flex items-center gap-1 text-[10px]">
                      <Calendar className="size-3 text-zinc-500" />
                      <span>{new Date(tx.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>
                    {tx.paymentMethod && (
                      <div className="flex items-center gap-1.5 font-sans font-medium text-[10px] text-zinc-400 uppercase">
                        <CreditCard className="size-3 text-zinc-500 shrink-0" />
                        <span>{tx.paymentMethod.replace(/_/g, ' ')}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openInspector(tx.gatewayResponse)}
                      className="h-8 text-[11px] font-medium border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 text-zinc-400 hover:text-white cursor-pointer"
                    >
                      <Eye className="size-3 mr-1" /> Payload
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-10 text-zinc-500 text-xs font-medium">
                  Tidak ada transaksi yang ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-zinc-500 text-xs font-medium">
          Halaman {page} dari {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white cursor-pointer text-xs"
          >
            <ArrowLeft className="size-3.5 mr-1" /> Sebelum
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white cursor-pointer text-xs"
          >
            Sesudah <ArrowRight className="size-3.5 ml-1" />
          </Button>
        </div>
      </div>

      {/* JSON Payload Inspector Dialog */}
      <Dialog open={isInspectorOpen} onOpenChange={setIsInspectorOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="border-b border-zinc-800/60 pb-3 flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="text-base font-bold text-zinc-200 flex items-center gap-2">
                <Receipt className="size-4.5 text-indigo-400" />
                Respon Log Payment Gateway
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className="pt-4 font-mono text-[11px] leading-relaxed">
            {activeResponse ? (
              <pre className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 overflow-x-auto text-indigo-300 max-h-[50vh] overflow-y-auto select-all">
                {JSON.stringify(activeResponse, null, 2)}
              </pre>
            ) : (
              <div className="bg-zinc-950/40 border border-zinc-850 p-6 rounded-xl text-center text-zinc-500 font-sans text-xs flex flex-col items-center gap-2">
                <Info className="size-5 text-zinc-500" />
                <p>Tidak ada payload respon resmi dari gateway.</p>
                <p className="text-[10px] text-zinc-600">Transaksi berstatus PENDING/belum memicu pemrosesan callback callback callback.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
