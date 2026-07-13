'use client';

import React from 'react';
import { GraduationCap, Users, Calendar, CheckCircle2 } from 'lucide-react';
import { Badge } from '@org/ui';

interface ClassSummaryCardProps {
  name: string;
  tahunAjaranNama?: string;
  tahunAjaranAktif?: boolean;
  studentCount: number;
  createdAt: string;
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  highlight?: boolean;
}

function StatItem({ icon, label, value, highlight }: StatItemProps) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-4 flex items-center gap-3">
      <div className={`size-9 rounded-lg flex items-center justify-center shrink-0 ${
        highlight ? 'bg-indigo-500/10' : 'bg-zinc-800/80'
      }`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">{label}</p>
        <p className={`text-lg font-bold ${highlight ? 'text-indigo-300' : 'text-zinc-100'}`}>{value}</p>
      </div>
    </div>
  );
}

export function ClassSummaryCard({
  name,
  tahunAjaranNama,
  tahunAjaranAktif,
  studentCount,
  createdAt,
}: ClassSummaryCardProps) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="size-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center shrink-0">
          <GraduationCap className="size-7 text-indigo-300" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-zinc-100">{name}</h2>
          {tahunAjaranNama && (
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-xs">
                <Calendar className="size-3 mr-1" />
                {tahunAjaranNama}
              </Badge>
              {tahunAjaranAktif && (
                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">
                  <CheckCircle2 className="size-3 mr-1" />
                  Tahun Ajaran Aktif
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-zinc-800/80" />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatItem
          icon={<Users className="size-4 text-indigo-400" />}
          label="Jumlah Santri"
          value={studentCount}
          highlight
        />
        <StatItem
          icon={<Calendar className="size-4 text-zinc-500" />}
          label="Dibuat"
          value={new Date(createdAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        />
      </div>
    </div>
  );
}
