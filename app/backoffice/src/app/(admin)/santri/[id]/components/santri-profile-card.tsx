'use client';

import React from 'react';
import { Badge } from '@org/ui';
import { User, MapPin, Sparkles, Mail, GraduationCap, Hash } from 'lucide-react';

interface SantriProfileCardProps {
  nis: string;
  nama: string;
  kelasNama: string;
  namaBapak: string | null;
  namaIbu: string | null;
  alamat: string | null;
  userId: string | null;
}

export function SantriProfileCard({
  nis,
  nama,
  kelasNama,
  namaBapak,
  namaIbu,
  alamat,
  userId,
}: SantriProfileCardProps) {
  const initials = nama
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 space-y-5">
      {/* Avatar + Name */}
      <div className="flex items-start gap-4">
        <div className="size-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center text-2xl font-bold text-indigo-300 shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-zinc-100 truncate">{nama}</h2>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <Badge variant="outline" className="border-zinc-700 text-zinc-300 text-xs">
              <GraduationCap className="size-3 mr-1 text-indigo-400" />
              {kelasNama}
            </Badge>
            {userId ? (
              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">
                <Sparkles className="size-3 mr-1" />
                Wali Tertaut
              </Badge>
            ) : (
              <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs">
                <Mail className="size-3 mr-1" />
                Wali Belum Tertaut
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="h-px bg-zinc-800/80" />

      {/* Detail Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold flex items-center gap-1">
            <Hash className="size-3" /> NIS
          </p>
          <p className="text-sm font-mono text-zinc-200">{nis}</p>
        </div>

        {alamat && (
          <div className="space-y-1">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold flex items-center gap-1">
              <MapPin className="size-3" /> Alamat
            </p>
            <p className="text-sm text-zinc-300">{alamat}</p>
          </div>
        )}

        {namaBapak && (
          <div className="space-y-1">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold flex items-center gap-1">
              <User className="size-3" /> Nama Ayah
            </p>
            <p className="text-sm text-zinc-300">Bpk. {namaBapak}</p>
          </div>
        )}

        {namaIbu && (
          <div className="space-y-1">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold flex items-center gap-1">
              <User className="size-3" /> Nama Ibu
            </p>
            <p className="text-sm text-zinc-300">Ibu {namaIbu}</p>
          </div>
        )}
      </div>
    </div>
  );
}
