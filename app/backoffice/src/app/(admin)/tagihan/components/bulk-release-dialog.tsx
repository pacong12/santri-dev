'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Input,
  Label,
} from '@org/ui';
import { FileSpreadsheet, AlertCircle } from 'lucide-react';
import { fetchApi } from '../../../../lib/api-client';

interface ClassItem {
  id: string;
  name: string;
}

interface AcademicYear {
  id: string;
  name: string;
  aktif: boolean;
}

interface BulkReleaseDialogProps {
  classes: ClassItem[];
  years: AcademicYear[];
  onSuccess: () => void;
}

export function BulkReleaseDialog({ classes, years, onSuccess }: BulkReleaseDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [bulkKelasId, setBulkKelasId] = useState('');
  const [bulkPeriode, setBulkPeriode] = useState('2026-07');
  const [bulkDueDate, setBulkDueDate] = useState('');
  const [bulkYearId, setBulkYearId] = useState('');
  const [bulkError, setBulkError] = useState<string | null>(null);

  // Sync initial selects
  useEffect(() => {
    if (classes.length > 0 && !bulkKelasId) {
      setBulkKelasId(classes[0].id);
    }
    if (years.length > 0 && !bulkYearId) {
      const active = years.find((y) => y.aktif);
      if (active) setBulkYearId(active.id);
      else setBulkYearId(years[0].id);
    }
  }, [classes, years]);

  const handleBulkRelease = async (e: React.FormEvent) => {
    e.preventDefault();
    setBulkError(null);
    if (!bulkKelasId || !bulkPeriode || !bulkDueDate) {
      setBulkError('Semua field wajib diisi.');
      return;
    }

    try {
      const res = await fetchApi('/tagihan/bulk', {
        method: 'POST',
        body: JSON.stringify({
          kelasId: bulkKelasId,
          periode: bulkPeriode,
          dueDate: bulkDueDate,
          tahunAjaranId: bulkYearId || null,
        }),
      });

      if (res.success) {
        onSuccess();
        setIsOpening(false);
      }
    } catch (e: any) {
      setBulkError(e.message || 'Gagal merilis tagihan massal.');
    }
  };

  const setIsOpening = (val: boolean) => {
    setIsOpen(val);
    if (!val) {
      setBulkError(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpening}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold gap-2 text-xs">
          <FileSpreadsheet className="size-4" />
          Rilis Tagihan Bulanan
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Tagihan Massal</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Terbitkan tagihan SPP kepada semua santri di kelas tertentu secara otomatis berdasarkan data tarif aktif.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleBulkRelease} className="space-y-4 py-2">
          {bulkError && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg flex items-center gap-2 text-xs">
              <AlertCircle className="size-4 shrink-0" />
              <span>{bulkError}</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bulkKelas">Pilih Kelas</Label>
              <select
                id="bulkKelas"
                value={bulkKelasId}
                onChange={(e) => setBulkKelasId(e.target.value)}
                className="w-full h-9 rounded-lg bg-zinc-900 border border-zinc-800 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bulkYear">Tahun Ajaran</Label>
              <select
                id="bulkYear"
                value={bulkYearId}
                onChange={(e) => setBulkYearId(e.target.value)}
                className="w-full h-9 rounded-lg bg-zinc-900 border border-zinc-800 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {years.map((y) => (
                  <option key={y.id} value={y.id}>
                    {y.name} {y.aktif ? '(Aktif)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bulkPeriode">Periode Bulan</Label>
              <Input
                id="bulkPeriode"
                value={bulkPeriode}
                onChange={(e) => setBulkPeriode(e.target.value)}
                placeholder="Contoh: 2026-07"
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bulkDueDate">Tanggal Jatuh Tempo</Label>
              <Input
                id="bulkDueDate"
                type="date"
                value={bulkDueDate}
                onChange={(e) => setBulkDueDate(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsOpening(false)} className="text-zinc-400">
              Batal
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
              Generate Tagihan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
