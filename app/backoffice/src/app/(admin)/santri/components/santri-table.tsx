'use client';

import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Button,
  Badge,
} from '@org/ui';
import { Trash2, TrendingUp, Mail, MapPin, Sparkles, Eye } from 'lucide-react';
import Link from 'next/link';

interface SantriItem {
  id: string;
  nis: string;
  nama: string;
  kelasId: string;
  namaBapak: string | null;
  namaIbu: string | null;
  alamat: string | null;
  userId: string | null;
}

interface ClassItem {
  id: string;
  name: string;
}

interface SantriTableProps {
  students: SantriItem[];
  classes: ClassItem[];
  isLoading: boolean;
  onPromoteClick: (student: SantriItem) => void;
  onLinkClick: (student: SantriItem) => void;
  onDeleteClick: (id: string) => void;
}

export function SantriTable({
  students,
  classes,
  isLoading,
  onPromoteClick,
  onLinkClick,
  onDeleteClick,
}: SantriTableProps) {
  return (
    <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl overflow-hidden shadow-xl">
      <Table>
        <TableHeader className="bg-zinc-900/50">
          <TableRow className="border-zinc-800">
            <TableHead className="text-zinc-400">NIS</TableHead>
            <TableHead className="text-zinc-400">Nama Santri</TableHead>
            <TableHead className="text-zinc-400">Kelas</TableHead>
            <TableHead className="text-zinc-400">Orang Tua (Wali)</TableHead>
            <TableHead className="text-zinc-400">Akun Wali</TableHead>
            <TableHead className="text-zinc-400 text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12 text-zinc-500 text-xs">
                Memuat data santri...
              </TableCell>
            </TableRow>
          ) : students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12 text-zinc-500 text-xs">
                Tidak ada data santri ditemukan.
              </TableCell>
            </TableRow>
          ) : (
            students.map((s) => {
              const classObj = classes.find((c) => c.id === s.kelasId);
              return (
                <TableRow key={s.id} className="border-zinc-800/50 hover:bg-zinc-900/20">
                  <TableCell className="font-mono text-zinc-400 text-xs">{s.nis}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-sm text-zinc-200">{s.nama}</p>
                      {s.alamat && (
                        <p className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="size-3 text-zinc-600 shrink-0" />
                          {s.alamat}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-zinc-800 text-zinc-300 text-xs">
                      {classObj ? classObj.name : 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-400 text-xs">
                    <div>
                      {s.namaBapak && <p>Bpk. {s.namaBapak}</p>}
                      {s.namaIbu && <p>Ibu {s.namaIbu}</p>}
                      {!s.namaBapak && !s.namaIbu && <span className="text-zinc-600">-</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    {s.userId ? (
                      <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 w-fit">
                        <Sparkles className="size-3" />
                        Taut
                      </Badge>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onLinkClick(s)}
                        className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 text-[10px] h-6 px-2 rounded"
                      >
                        <Mail className="size-3 mr-1" />
                        Tautkan Wali
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/santri/${s.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Lihat Detail"
                          className="text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10 size-8 rounded-lg"
                        >
                          <Eye className="size-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onPromoteClick(s)}
                        title="Kenaikan Kelas"
                        className="text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10 size-8 rounded-lg"
                      >
                        <TrendingUp className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteClick(s.id)}
                        title="Hapus Data"
                        className="text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 size-8 rounded-lg"
                      >
                        <Trash2 className="size-4" />
                      </Button>
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
