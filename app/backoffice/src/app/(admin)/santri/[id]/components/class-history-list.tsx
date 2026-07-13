'use client';

import React from 'react';
import { History, TrendingUp, Calendar } from 'lucide-react';

interface RiwayatItem {
  id: string;
  kelasLamaId: string | null;
  kelasBaruId: string;
  tanggal: string;
  kelasLamaNama?: string;
  kelasBaruNama?: string;
}

interface ClassHistoryListProps {
  riwayat: RiwayatItem[];
  isLoading: boolean;
}

export function ClassHistoryList({ riwayat, isLoading }: ClassHistoryListProps) {
  return (
    <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-800/80 flex items-center gap-2">
        <History className="size-4 text-indigo-400" />
        <h3 className="text-sm font-semibold text-zinc-200">Riwayat Mutasi Kelas</h3>
        <span className="ml-auto text-xs text-zinc-500">{riwayat.length} mutasi</span>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-zinc-500 text-xs">Memuat riwayat...</div>
      ) : riwayat.length === 0 ? (
        <div className="text-center py-8 text-zinc-600 text-xs">
          Belum ada riwayat mutasi kelas.
        </div>
      ) : (
        <div className="divide-y divide-zinc-800/50">
          {riwayat.map((r, idx) => (
            <div key={r.id} className="flex items-center gap-4 px-4 py-3 hover:bg-zinc-900/20">
              {/* Timeline dot */}
              <div className="relative flex flex-col items-center">
                <div className={`size-7 rounded-full flex items-center justify-center shrink-0 ${
                  idx === 0
                    ? 'bg-indigo-500/20 border border-indigo-500/40'
                    : 'bg-zinc-800 border border-zinc-700'
                }`}>
                  <TrendingUp className={`size-3.5 ${idx === 0 ? 'text-indigo-400' : 'text-zinc-500'}`} />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {r.kelasLamaNama ? (
                    <>
                      <span className="text-xs text-zinc-500 font-mono">{r.kelasLamaNama}</span>
                      <span className="text-zinc-600">→</span>
                    </>
                  ) : null}
                  <span className={`text-xs font-semibold ${idx === 0 ? 'text-indigo-300' : 'text-zinc-300'}`}>
                    {r.kelasBaruNama || r.kelasBaruId}
                  </span>
                  {idx === 0 && (
                    <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                      Kelas Aktif
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 text-zinc-500 text-[10px] font-mono shrink-0">
                <Calendar className="size-3" />
                {new Date(r.tanggal).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
