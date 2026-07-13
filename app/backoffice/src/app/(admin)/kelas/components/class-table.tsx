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
} from '@org/ui';
import { GraduationCap, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

interface ClassItem {
  id: string;
  name: string;
  tahunAjaranId: string;
  createdAt: string;
}

interface AcademicYear {
  id: string;
  name: string;
  aktif: boolean;
}

interface ClassTableProps {
  classes: ClassItem[];
  academicYears: AcademicYear[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

export function ClassTable({ classes, academicYears, isLoading, onDelete }: ClassTableProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-zinc-300 flex items-center gap-2">
        <GraduationCap className="size-4 text-indigo-400" />
        Daftar Kelas Tingkat
      </h3>
      <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl overflow-hidden shadow-xl">
        <Table>
          <TableHeader className="bg-zinc-900/50">
            <TableRow className="border-zinc-800">
              <TableHead className="text-zinc-400">Nama Kelas</TableHead>
              <TableHead className="text-zinc-400">Tahun Ajaran</TableHead>
              <TableHead className="text-zinc-400 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-zinc-500 text-xs">
                  Memuat data kelas...
                </TableCell>
              </TableRow>
            ) : classes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-zinc-500 text-xs">
                  Belum ada kelas terdaftar. Silakan tambah kelas.
                </TableCell>
              </TableRow>
            ) : (
              classes.map((c) => {
                const year = academicYears.find((y) => y.id === c.tahunAjaranId);
                return (
                  <TableRow key={c.id} className="border-zinc-800/50 hover:bg-zinc-900/20">
                    <TableCell className="font-medium text-zinc-200">{c.name}</TableCell>
                    <TableCell className="text-zinc-400 text-xs">
                      {year ? (
                        <span className="flex items-center gap-1.5">
                          {year.name}
                          {year.aktif && (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          )}
                        </span>
                      ) : (
                        'Tidak Ditemukan'
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/kelas/${c.id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Lihat Detail Kelas"
                            className="text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10 size-8 rounded-lg"
                          >
                            <Eye className="size-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(c.id)}
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
    </div>
  );
}
