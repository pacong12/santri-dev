'use client';

import React from 'react';
import { DollarSign } from 'lucide-react';

interface PricingItem {
  id: string;
  kelasId: string;
  jenisTagihanId: string;
  amount: number | string;
  periode: string;
}

interface ClassItem {
  id: string;
  name: string;
}

interface JenisTagihan {
  id: string;
  name: string;
}

interface PricingListProps {
  pricings: PricingItem[];
  classes: ClassItem[];
  types: JenisTagihan[];
  isLoading: boolean;
}

export function PricingList({ pricings, classes, types, isLoading }: PricingListProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-zinc-300 flex items-center gap-2">
        <DollarSign className="size-4 text-indigo-400" />
        Tarif Aktif Per Kelas
      </h3>
      <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-4 divide-y divide-zinc-800/50 space-y-3">
        {isLoading ? (
          <div className="py-8 text-center text-xs text-zinc-500">Memuat data tarif...</div>
        ) : pricings.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500">Belum ada konfigurasi tarif kelas.</div>
        ) : (
          pricings.map((p) => {
            const targetCls = classes.find((c) => c.id === p.kelasId);
            const targetType = types.find((t) => t.id === p.jenisTagihanId);
            return (
              <div key={p.id} className="flex items-center justify-between pt-3 first:pt-0">
                <div>
                  <p className="font-semibold text-sm text-zinc-200">
                    Kelas {targetCls ? targetCls.name : 'N/A'}
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    {targetType ? targetType.name : 'Iuran'} ({p.periode === 'MONTHLY' ? 'Bulanan' : 'Sekali Bayar'})
                  </p>
                </div>
                <span className="font-mono text-xs font-semibold text-emerald-400">
                  Rp {Number(p.amount).toLocaleString('id-ID')}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
