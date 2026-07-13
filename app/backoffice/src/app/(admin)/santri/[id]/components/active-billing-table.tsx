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
import { Calendar, XCircle, Receipt } from 'lucide-react';
import Link from 'next/link';

interface TagihanItem {
  id: string;
  nama: string;
  amount: number | string;
  periode: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  dueDate: string;
}

interface ActiveBillingTableProps {
  bills: TagihanItem[];
  isLoading: boolean;
  onCancelClick?: (billId: string) => void;
}

const statusMap: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'Belum Lunas', className: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
  PAID: { label: 'Lunas', className: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
  CANCELLED: { label: 'Dibatalkan', className: 'bg-zinc-800 text-zinc-500 border border-zinc-700' },
};

export function ActiveBillingTable({ bills, isLoading, onCancelClick }: ActiveBillingTableProps) {
  return (
    <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-800/80 flex items-center gap-2">
        <Receipt className="size-4 text-indigo-400" />
        <h3 className="text-sm font-semibold text-zinc-200">Riwayat Tagihan</h3>
        <span className="ml-auto text-xs text-zinc-500">{bills.length} tagihan</span>
      </div>
      <Table>
        <TableHeader className="bg-zinc-900/50">
          <TableRow className="border-zinc-800">
            <TableHead className="text-zinc-400">Nama Tagihan</TableHead>
            <TableHead className="text-zinc-400">Periode</TableHead>
            <TableHead className="text-zinc-400">Nominal</TableHead>
            <TableHead className="text-zinc-400">Jatuh Tempo</TableHead>
            <TableHead className="text-zinc-400">Status</TableHead>
            <TableHead className="text-zinc-400 text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-zinc-500 text-xs">
                Memuat data tagihan...
              </TableCell>
            </TableRow>
          ) : bills.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-zinc-500 text-xs">
                Belum ada tagihan untuk santri ini.
              </TableCell>
            </TableRow>
          ) : (
            bills.map((b) => {
              const s = statusMap[b.status] || statusMap['PENDING'];
              return (
                <TableRow key={b.id} className="border-zinc-800/50 hover:bg-zinc-900/20">
                  <TableCell className="text-sm text-zinc-200 font-medium">{b.nama}</TableCell>
                  <TableCell className="font-mono text-xs text-zinc-400">{b.periode}</TableCell>
                  <TableCell className="font-mono text-xs text-zinc-200">
                    Rp {Number(b.amount).toLocaleString('id-ID')}
                  </TableCell>
                  <TableCell className="text-zinc-400 text-xs font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3 text-zinc-600" />
                      {new Date(b.dueDate).toLocaleDateString('id-ID')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={s.className}>{s.label}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/tagihan/${b.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10 text-xs h-7 px-2"
                        >
                          Detail
                        </Button>
                      </Link>
                      {b.status === 'PENDING' && onCancelClick && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onCancelClick(b.id)}
                          className="text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 size-7 rounded-lg"
                          title="Batalkan Tagihan"
                        >
                          <XCircle className="size-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
