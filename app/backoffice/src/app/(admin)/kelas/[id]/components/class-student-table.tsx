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
import { User, MapPin, Sparkles, Mail, Eye } from 'lucide-react';
import Link from 'next/link';

interface SantriItem {
  id: string;
  nis: string;
  nama: string;
  namaBapak: string | null;
  namaIbu: string | null;
  alamat: string | null;
  userId: string | null;
}

interface ClassStudentTableProps {
  students: SantriItem[];
  isLoading: boolean;
}

export function ClassStudentTable({ students, isLoading }: ClassStudentTableProps) {
  return (
    <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl overflow-hidden shadow-xl">
      <div className="px-4 py-3 border-b border-zinc-800/80 flex items-center gap-2">
        <User className="size-4 text-indigo-400" />
        <h3 className="text-sm font-semibold text-zinc-200">Daftar Santri di Kelas Ini</h3>
        <span className="ml-auto text-xs text-zinc-500">{students.length} santri</span>
      </div>
      <Table>
        <TableHeader className="bg-zinc-900/50">
          <TableRow className="border-zinc-800">
            <TableHead className="text-zinc-400">NIS</TableHead>
            <TableHead className="text-zinc-400">Nama Santri</TableHead>
            <TableHead className="text-zinc-400">Orang Tua</TableHead>
            <TableHead className="text-zinc-400">Akun Wali</TableHead>
            <TableHead className="text-zinc-400 text-right">Detail</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-zinc-500 text-xs">
                Memuat daftar santri...
              </TableCell>
            </TableRow>
          ) : students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-zinc-500 text-xs">
                Belum ada santri yang terdaftar di kelas ini.
              </TableCell>
            </TableRow>
          ) : (
            students.map((s) => (
              <TableRow key={s.id} className="border-zinc-800/50 hover:bg-zinc-900/20">
                <TableCell className="font-mono text-zinc-400 text-xs">{s.nis}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-semibold text-sm text-zinc-200">{s.nama}</p>
                    {s.alamat && (
                      <p className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="size-3 shrink-0" />
                        {s.alamat}
                      </p>
                    )}
                  </div>
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
                    <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 w-fit text-xs">
                      <Sparkles className="size-3" />
                      Tertaut
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1 w-fit text-xs">
                      <Mail className="size-3" />
                      Belum
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/santri/${s.id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10 size-8 rounded-lg"
                      title="Lihat Profil Santri"
                    >
                      <Eye className="size-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
