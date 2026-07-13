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
import { Settings2, AlertCircle } from 'lucide-react';
import { fetchApi } from '../../../../lib/api-client';

interface JenisTagihan {
  id: string;
  name: string;
}

interface BillingTypeDialogProps {
  onSuccess: (newType: JenisTagihan) => void;
}

export function BillingTypeDialog({ onSuccess }: BillingTypeDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [jenisNama, setJenisNama] = useState('');
  const [jenisError, setJenisError] = useState<string | null>(null);

  const handleCreateJenis = async (e: React.FormEvent) => {
    e.preventDefault();
    setJenisError(null);
    if (!jenisNama.trim()) {
      setJenisError('Nama jenis tagihan wajib diisi.');
      return;
    }

    try {
      const res = await fetchApi<JenisTagihan>('/tagihan/jenis', {
        method: 'POST',
        body: JSON.stringify({
          nama: jenisNama,
        }),
      });

      if (res.success && res.data) {
        onSuccess(res.data);
        setJenisNama('');
        setIsOpen(false);
      }
    } catch (e: any) {
      setJenisError(e.message || 'Gagal membuat jenis tagihan.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 gap-2 text-xs">
          <Settings2 className="size-4" />
          Jenis Tagihan
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle>Tambah Jenis Tagihan</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Buat jenis item biaya (contoh: SPP, Uang Makan, Seragam).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateJenis} className="space-y-4 py-2">
          {jenisError && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg flex items-center gap-2 text-xs">
              <AlertCircle className="size-4 shrink-0" />
              <span>{jenisError}</span>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="jenisNama">Nama Jenis Tagihan</Label>
            <Input
              id="jenisNama"
              value={jenisNama}
              onChange={(e) => setJenisNama(e.target.value)}
              placeholder="Contoh: Uang Buku"
              className="bg-zinc-900 border-zinc-800 text-white"
            />
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="text-zinc-400">
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
