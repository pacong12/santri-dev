'use client';

import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Badge,
} from '@org/ui';
import { Calendar } from 'lucide-react';

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

interface TransactionTableProps {
  transactions: TransaksiItem[];
  isLoading: boolean;
}

export function TransactionTable({ transactions, isLoading }: TransactionTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Sukses</Badge>;
      case 'PENDING':
        return <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20">Menunggu</Badge>;
      case 'EXPIRED':
        return <Badge className="bg-zinc-800 text-zinc-500 border border-zinc-700">Kedaluwarsa</Badge>;
      default:
        return <Badge className="bg-rose-500/10 text-rose-400 border border-rose-500/20">Gagal</Badge>;
    }
  };

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl overflow-hidden shadow-xl">
      <Table>
        <TableHeader className="bg-zinc-900/50">
          <TableRow className="border-zinc-800">
            <TableHead className="text-zinc-400">Order ID</TableHead>
            <TableHead className="text-zinc-400">Total Bayar (Gross)</TableHead>
            <TableHead className="text-zinc-400">Platform Fee</TableHead>
            <TableHead className="text-zinc-400">Gateway Fee</TableHead>
            <TableHead className="text-zinc-400">Diterima Bersih</TableHead>
            <TableHead className="text-zinc-400">Metode</TableHead>
            <TableHead className="text-zinc-400">Status</TableHead>
            <TableHead className="text-zinc-400">Waktu Bayar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12 text-zinc-500 text-xs">
                Memuat mutasi transaksi...
              </TableCell>
            </TableRow>
          ) : transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12 text-zinc-500 text-xs">
                Tidak ada data transaksi yang cocok dengan status filter.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((t) => (
              <TableRow key={t.id} className="border-zinc-800/50 hover:bg-zinc-900/20">
                <TableCell className="font-mono text-xs text-zinc-200">{t.orderId}</TableCell>
                <TableCell className="font-mono text-xs text-zinc-300">
                  Rp {Number(t.amount).toLocaleString('id-ID')}
                </TableCell>
                <TableCell className="font-mono text-xs text-zinc-500">
                  Rp {Number(t.platformFee).toLocaleString('id-ID')}
                </TableCell>
                <TableCell className="font-mono text-xs text-zinc-500">
                  Rp {Number(t.gatewayFee).toLocaleString('id-ID')}
                </TableCell>
                <TableCell className="font-mono text-xs text-emerald-400 font-semibold">
                  Rp {Number(t.netAmount).toLocaleString('id-ID')}
                </TableCell>
                <TableCell className="text-zinc-400 text-xs uppercase">
                  {t.paymentMethod || '-'}
                </TableCell>
                <TableCell>{getStatusBadge(t.status)}</TableCell>
                <TableCell className="text-zinc-400 text-[10px] font-mono">
                  {t.paidAt ? (
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3 text-zinc-600" />
                      {new Date(t.paidAt).toLocaleString('id-ID')}
                    </span>
                  ) : (
                    '-'
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
