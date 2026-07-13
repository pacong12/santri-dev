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
import { DollarSign, AlertCircle } from 'lucide-react';
import { fetchApi } from '../../../../lib/api-client';

interface ClassItem {
  id: string;
  name: string;
}

interface JenisTagihan {
  id: string;
  name: string;
}

interface PricingItem {
  id: string;
  kelasId: string;
  jenisTagihanId: string;
  amount: number | string;
  periode: string;
}

interface PricingTemplateDialogProps {
  classes: ClassItem[];
  types: JenisTagihan[];
  onSuccess: (newPricing: PricingItem) => void;
}

export function PricingTemplateDialog({ classes, types, onSuccess }: PricingTemplateDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [priceKelasId, setPriceKelasId] = useState('');
  const [priceTypeId, setPriceTypeId] = useState('');
  const [priceAmount, setPriceAmount] = useState('');
  const [pricePeriode] = useState('MONTHLY');
  const [priceError, setPriceError] = useState<string | null>(null);

  // Sync initial selects
  useEffect(() => {
    if (classes.length > 0 && !priceKelasId) {
      setPriceKelasId(classes[0].id);
    }
    if (types.length > 0 && !priceTypeId) {
      setPriceTypeId(types[0].id);
    }
  }, [classes, types]);

  const handleCreatePricing = async (e: React.FormEvent) => {
    e.preventDefault();
    setPriceError(null);
    if (!priceKelasId || !priceTypeId || !priceAmount || !pricePeriode) {
      setPriceError('Semua field wajib diisi.');
      return;
    }

    try {
      const res = await fetchApi<PricingItem>('/tagihan/pricing', {
        method: 'POST',
        body: JSON.stringify({
          kelasId: priceKelasId,
          jenisTagihanId: priceTypeId,
          amount: parseFloat(priceAmount),
          periode: pricePeriode,
        }),
      });

      if (res.success && res.data) {
        onSuccess(res.data);
        setPriceAmount('');
        setIsOpen(false);
      }
    } catch (e: any) {
      setPriceError(e.message || 'Gagal membuat konfigurasi tarif.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 gap-2 text-xs">
          <DollarSign className="size-4" />
          Atur Tarif Kelas
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle>Konfigurasi Tarif Bulanan</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Tetapkan biaya default bulanan untuk tingkatan kelas tertentu.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreatePricing} className="space-y-4 py-2">
          {priceError && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg flex items-center gap-2 text-xs">
              <AlertCircle className="size-4 shrink-0" />
              <span>{priceError}</span>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="priceKelas">Kelas Tujuan</Label>
            <select
              id="priceKelas"
              value={priceKelasId}
              onChange={(e) => setPriceKelasId(e.target.value)}
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
            <Label htmlFor="priceType">Jenis Tagihan</Label>
            <select
              id="priceType"
              value={priceTypeId}
              onChange={(e) => setPriceTypeId(e.target.value)}
              className="w-full h-9 rounded-lg bg-zinc-900 border border-zinc-800 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="priceAmount">Jumlah Nominal (Rp)</Label>
            <Input
              id="priceAmount"
              type="number"
              value={priceAmount}
              onChange={(e) => setPriceAmount(e.target.value)}
              placeholder="Contoh: 350000"
              className="bg-zinc-900 border-zinc-800 text-white"
            />
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="text-zinc-400">
              Batal
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
              Simpan Tarif
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
