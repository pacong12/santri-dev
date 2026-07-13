'use client';

import React from 'react';
import { Badge } from '@org/ui';
import { Receipt, Calendar, Hash, Tag, User } from 'lucide-react';
import Link from 'next/link';

interface BillingDetailCardProps {
  id: string;
  nama: string;
  periode: string;
  dueDate: string;
  createdAt: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  santriNama?: string;
  santriId?: string;
  santriNis?: string;
  jenisTagihanNama?: string;
}

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  PENDING: { label: 'Menunggu Pembayaran', color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20', dot: 'bg-amber-400' },
  PAID: { label: 'Lunas', color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', dot: 'bg-emerald-400' },
  CANCELLED: { label: 'Dibatalkan', color: 'bg-zinc-800 text-zinc-500 border border-zinc-700', dot: 'bg-zinc-600' },
};

export function BillingDetailCard({
  id,
  nama,
  periode,
  dueDate,
  createdAt,
  status,
  santriNama,
  santriId,
  santriNis,
  jenisTagihanNama,
}: BillingDetailCardProps) {
  const cfg = statusConfig[status] || statusConfig['PENDING'];

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 space-y-5">
      {/* Status Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="size-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
          <Receipt className="size-5 text-indigo-400" />
        </div>
        <Badge className={`${cfg.color} flex items-center gap-1.5`}>
          <span className={`size-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </Badge>
      </div>

      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-zinc-100">{nama}</h2>
        <p className="text-zinc-500 text-xs font-mono mt-1">ID: {id.slice(0, 8)}…</p>
      </div>

      <div className="h-px bg-zinc-800/80" />

      {/* Meta grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {santriNama && (
          <div className="space-y-1">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold flex items-center gap-1">
              <User className="size-3" /> Santri
            </p>
            {santriId ? (
              <Link href={`/santri/${santriId}`} className="group">
                <p className="text-sm text-indigo-400 group-hover:text-indigo-300 transition-colors">
                  {santriNama}
                </p>
                {santriNis && <p className="text-[10px] text-zinc-500 font-mono">{santriNis}</p>}
              </Link>
            ) : (
              <p className="text-sm text-zinc-200">{santriNama}</p>
            )}
          </div>
        )}

        {jenisTagihanNama && (
          <div className="space-y-1">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold flex items-center gap-1">
              <Tag className="size-3" /> Jenis Tagihan
            </p>
            <p className="text-sm text-zinc-300">{jenisTagihanNama}</p>
          </div>
        )}

        <div className="space-y-1">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold flex items-center gap-1">
            <Hash className="size-3" /> Periode
          </p>
          <p className="text-sm font-mono text-zinc-200">{periode}</p>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold flex items-center gap-1">
            <Calendar className="size-3" /> Jatuh Tempo
          </p>
          <p className="text-sm text-zinc-200">
            {new Date(dueDate).toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold flex items-center gap-1">
            <Calendar className="size-3" /> Tanggal Diterbitkan
          </p>
          <p className="text-sm text-zinc-400 font-mono">
            {new Date(createdAt).toLocaleDateString('id-ID')}
          </p>
        </div>
      </div>
    </div>
  );
}
