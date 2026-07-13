'use client';

import React, { useState } from 'react';
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
import { Calendar, AlertCircle } from 'lucide-react';
import { fetchApi } from '../../../../lib/api-client';

interface AcademicYear {
  id: string;
  name: string;
  aktif: boolean;
  createdAt: string;
}

interface AcademicYearDialogProps {
  onSuccess: (newYear: AcademicYear, wasActive: boolean) => void;
}

export function AcademicYearDialog({ onSuccess }: AcademicYearDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [yearName, setYearName] = useState('');
  const [yearActive, setYearActive] = useState(true);
  const [yearFormError, setYearFormError] = useState<string | null>(null);

  const handleCreateYear = async (e: React.FormEvent) => {
    e.preventDefault();
    setYearFormError(null);
    if (!yearName.trim()) {
      setYearFormError('Nama tahun ajaran tidak boleh kosong.');
      return;
    }

    try {
      const res = await fetchApi<AcademicYear>('/kelas/tahun-ajaran', {
        method: 'POST',
        body: JSON.stringify({
          name: yearName,
          aktif: yearActive,
        }),
      });

      if (res.success && res.data) {
        onSuccess(res.data, yearActive);
        setYearName('');
        setIsOpen(false);
      }
    } catch (e: any) {
      setYearFormError(e.message || 'Gagal menambahkan tahun ajaran.');
    }
  };

  const setIsOpening = (val: boolean) => {
    setIsOpen(val);
    if (!val) {
      setYearFormError(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpening}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 gap-2">
          <Calendar className="size-4" />
          Tahun Ajaran Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle>Tambah Tahun Ajaran</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Buat tahun akademik baru (format contoh: 2026/2027).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateYear} className="space-y-4 py-2">
          {yearFormError && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg flex items-center gap-2 text-xs">
              <AlertCircle className="size-4 shrink-0" />
              <span>{yearFormError}</span>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="yearName">Nama Tahun Ajaran</Label>
            <Input
              id="yearName"
              value={yearName}
              onChange={(e) => setYearName(e.target.value)}
              placeholder="Contoh: 2026/2027"
              className="bg-zinc-900 border-zinc-800 text-white"
            />
          </div>
          <div className="flex items-center gap-2 py-2">
            <input
              type="checkbox"
              id="yearActive"
              checked={yearActive}
              onChange={(e) => setYearActive(e.target.checked)}
              className="rounded bg-zinc-900 border-zinc-800 accent-indigo-500 size-4 cursor-pointer"
            />
            <Label htmlFor="yearActive" className="cursor-pointer text-xs">Setel sebagai Tahun Ajaran Aktif</Label>
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsOpening(false)} className="text-zinc-400">
              Batal
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
