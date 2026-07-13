'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  Label,
} from '@org/ui';
import { AlertCircle } from 'lucide-react';
import { fetchApi } from '../../../../lib/api-client';

interface SantriItem {
  id: string;
  nis: string;
  nama: string;
  kelasId: string;
}

interface ClassItem {
  id: string;
  name: string;
}

interface PromoteClassDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  student: SantriItem | null;
  classes: ClassItem[];
  onSuccess: (studentId: string, newKelasId: string) => void;
}

export function PromoteClassDialog({
  isOpen,
  onOpenChange,
  student,
  classes,
  onSuccess,
}: PromoteClassDialogProps) {
  const [newKelasId, setNewKelasId] = useState('');
  const [promoteError, setPromoteError] = useState<string | null>(null);

  // Sync initial select
  useEffect(() => {
    if (classes.length > 0 && !newKelasId) {
      setNewKelasId(classes[0].id);
    }
  }, [classes]);

  useEffect(() => {
    if (!isOpen) {
      setPromoteError(null);
    }
  }, [isOpen]);

  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromoteError(null);
    if (!student || !newKelasId) {
      setPromoteError('Silakan pilih kelas baru.');
      return;
    }

    try {
      const res = await fetchApi<SantriItem>(`/santri/${student.id}/promote`, {
        method: 'POST',
        body: JSON.stringify({ newKelasId }),
      });

      if (res.success && res.data) {
        onSuccess(student.id, newKelasId);
        onOpenChange(false);
      }
    } catch (e: any) {
      setPromoteError(e.message || 'Gagal memindahkan kelas.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle>Kenaikan / Pindah Kelas</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Pindahkan santri **{student?.nama}** ke tingkat kelas baru.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handlePromote} className="space-y-4 py-2">
          {promoteError && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg flex items-center gap-2 text-xs">
              <AlertCircle className="size-4 shrink-0" />
              <span>{promoteError}</span>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="promoteKelas">Pilih Kelas Baru</Label>
            <select
              id="promoteKelas"
              value={newKelasId}
              onChange={(e) => setNewKelasId(e.target.value)}
              className="w-full h-9 rounded-lg bg-zinc-900 border border-zinc-800 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-zinc-400">
              Batal
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
              Proses Pindah
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
