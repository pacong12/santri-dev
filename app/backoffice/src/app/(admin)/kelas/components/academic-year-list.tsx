'use client';

import React from 'react';
import { Badge } from '@org/ui';
import { Clock, Sparkles } from 'lucide-react';

interface AcademicYear {
  id: string;
  name: string;
  aktif: boolean;
  createdAt: string;
}

interface AcademicYearListProps {
  academicYears: AcademicYear[];
  isLoading: boolean;
}

export function AcademicYearList({ academicYears, isLoading }: AcademicYearListProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-zinc-300 flex items-center gap-2">
        <Clock className="size-4 text-indigo-400" />
        Tahun Ajaran
      </h3>
      <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-4 divide-y divide-zinc-800/50 space-y-3">
        {isLoading ? (
          <div className="py-8 text-center text-xs text-zinc-500">Memuat data...</div>
        ) : academicYears.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500">Belum ada tahun ajaran.</div>
        ) : (
          academicYears.map((y) => (
            <div key={y.id} className="flex items-center justify-between pt-3 first:pt-0">
              <div>
                <p className="font-semibold text-sm text-zinc-200">{y.name}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  Dibuat {new Date(y.createdAt).toLocaleDateString('id-ID')}
                </p>
              </div>
              {y.aktif ? (
                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <Sparkles className="size-3" />
                  Aktif
                </Badge>
              ) : (
                <Badge variant="outline" className="border-zinc-800 text-zinc-500">
                  Nonaktif
                </Badge>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
