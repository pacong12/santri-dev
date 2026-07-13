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
  Button,
} from '@org/ui';
import { Receipt, Filter, Ban, Eye } from 'lucide-react';
import Link from 'next/link';

interface TagihanItem {
  id: string;
  santriId: string;
  jenisTagihanId: string;
  tahunAjaranId: string | null;
  nama: string;
  amount: number | string;
  periode: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  dueDate: string;
  createdAt: string;
}

interface BillingTableProps {
  bills: TagihanItem[];
  isLoading: boolean;
  statusFilter: 'ALL' | 'PENDING' | 'PAID' | 'CANCELLED';
  onStatusFilterChange: (status: 'ALL' | 'PENDING' | 'PAID' | 'CANCELLED') => void;
  onCancelClick: (billId: string) => void;
}

export function BillingTable({
  bills,
  isLoading,
  statusFilter,
  onStatusFilterChange,
  onCancelClick,
}: BillingTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Lunas</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-zinc-800 text-zinc-500 border border-zinc-700">Dibatalkan</Badge>;
      default:
        return <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20">Tertunggak</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg text-zinc-300 flex items-center gap-2">
          <Receipt className="size-4 text-indigo-400" />
          Monitoring Riwayat Tagihan
        </h3>
        <div className="flex items-center gap-2">
          <Filter className="size-3.5 text-zinc-500" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as any)}
            className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-white"
          >
            <option value="ALL">Semua Status</option>
            <option value="PENDING">Tertunggak</option>
            <option value="PAID">Lunas</option>
            <option value="CANCELLED">Dibatalkan</option>
          </select>
        </div>
      </div>

      <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl overflow-hidden shadow-xl">
        <Table>
          <TableHeader className="bg-zinc-900/50">
            <TableRow className="border-zinc-800">
              <TableHead className="text-zinc-400">Nama Tagihan</TableHead>
              <TableHead className="text-zinc-400">Periode</TableHead>
              <TableHead className="text-zinc-400">Jatuh Tempo</TableHead>
              <TableHead className="text-zinc-400">Jumlah</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-zinc-500 text-xs">
                  Memuat tagihan...
                </TableCell>
              </TableRow>
            ) : bills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-zinc-500 text-xs">
                  Tidak ada data tagihan ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              bills.map((b) => (
                <TableRow key={b.id} className="border-zinc-800/50 hover:bg-zinc-900/20">
                  <TableCell className="font-semibold text-xs text-zinc-200">
                    {b.nama}
                  </TableCell>
                  <TableCell className="text-zinc-400 text-xs font-mono">{b.periode}</TableCell>
                  <TableCell className="text-zinc-400 text-xs font-mono">
                    {new Date(b.dueDate).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-zinc-300">
                    Rp {Number(b.amount).toLocaleString('id-ID')}
                  </TableCell>
                  <TableCell>{getStatusBadge(b.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/tagihan/${b.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Lihat Detail"
                          className="text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10 size-8 rounded-lg"
                        >
                          <Eye className="size-3.5" />
                        </Button>
                      </Link>
                      {b.status === 'PENDING' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onCancelClick(b.id)}
                          title="Batalkan Tagihan"
                          className="text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 size-8 rounded-lg"
                        >
                          <Ban className="size-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
