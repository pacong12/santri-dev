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
import { Plus, AlertCircle } from 'lucide-react';
import { fetchApi } from '../../../../lib/api-client';

interface AcademicYear {
  id: string;
  name: string;
  aktif: boolean;
}

interface ClassItem {
  id: string;
  name: string;
  tahunAjaranId: string;
  createdAt: string;
}

interface ClassDialogProps {
  academicYears: AcademicYear[];
  onSuccess: (newClass: ClassItem) => void;
}

export function ClassDialog({ academicYears, onSuccess }: ClassDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [className, setClassName] = useState('');
  const [selectedYearId, setSelectedYearId] = useState('');
  const [classFormError, setClassFormError] = useState<string | null>(null);

  // Sync initial select with active year
  useEffect(() => {
    if (academicYears.length > 0 && !selectedYearId) {
      const active = academicYears.find((y) => y.aktif);
      if (active) setSelectedYearId(active.id);
      else setSelectedYearId(academicYears[0].id);
    }
  }, [academicYears]);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setClassFormError(null);
    if (!className.trim()) {
      setClassFormError('Nama kelas tidak boleh kosong.');
      return;
    }
    if (!selectedYearId) {
      setClassFormError('Silakan pilih tahun ajaran.');
      return;
    }

    try {
      const res = await fetchApi<ClassItem>('/kelas', {
        method: 'POST',
        body: JSON.stringify({
          name: className,
          tahunAjaranId: selectedYearId,
        }),
      });

      if (res.success && res.data) {
        onSuccess(res.data);
        setClassName('');
        setIsOpen(false);
      }
    } catch (e: any) {
      setClassFormError(e.message || 'Gagal menambahkan kelas.');
    }
  };

  const setIsOpening = (val: boolean) => {
    setIsOpen(val);
    if (!val) {
      setClassFormError(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpening}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold gap-2">
          <Plus className="size-4" />
          Tambah Kelas
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle>Buat Kelas Baru</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Daftarkan tingkatan kelas baru di bawah tahun ajaran yang dipilih.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateClass} className="space-y-4 py-2">
          {classFormError && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg flex items-center gap-2 text-xs">
              <AlertCircle className="size-4 shrink-0" />
              <span>{classFormError}</span>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="className">Nama Kelas</Label>
            <Input
              id="className"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Contoh: VII-A, VIII-B"
              className="bg-zinc-900 border-zinc-800 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="classYear">Tahun Ajaran</Label>
            <select
              id="classYear"
              value={selectedYearId}
              onChange={(e) => setSelectedYearId(e.target.value)}
              className="w-full rounded-lg bg-zinc-900 border border-zinc-800 p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Pilih Tahun Ajaran</option>
              {academicYears.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.name} {y.aktif ? '(Aktif)' : ''}
                </option>
              ))}
            </select>
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
