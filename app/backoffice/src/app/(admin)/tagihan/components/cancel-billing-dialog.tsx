'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  Input,
  Button,
} from '@org/ui';
import { AlertCircle } from 'lucide-react';
import { fetchApi } from '../../../../lib/api-client';

interface TagihanItem {
  id: string;
  nama: string;
}

interface CancelBillingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  billId: string | null;
  onSuccess: (cancelledBillId: string) => void;
}

export function CancelBillingDialog({ isOpen, onOpenChange, billId, onSuccess }: CancelBillingDialogProps) {
  const [cancelReason, setCancelReason] = useState('');
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Clear inputs when closed
  useEffect(() => {
    if (!isOpen) {
      setCancelReason('');
      setCancelError(null);
    }
  }, [isOpen]);

  const handleCancelBill = async (e: React.FormEvent) => {
    e.preventDefault();
    setCancelError(null);
    if (!billId || !cancelReason.trim()) {
      setCancelError('Alasan pembatalan wajib diisi.');
      return;
    }

    try {
      const res = await fetchApi<TagihanItem>(`/tagihan/${billId}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason: cancelReason }),
      });

      if (res.success && res.data) {
        onSuccess(billId);
        onOpenChange(false);
      }
    } catch (e: any) {
      setCancelError(e.message || 'Gagal membatalkan tagihan.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-rose-400">Batalkan Tagihan</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Tindakan pembatalan tagihan bersifat sensitif. Anda wajib mencantumkan alasan yang sah untuk dicatat di Audit Log.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCancelBill} className="space-y-4 py-2">
          {cancelError && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg flex items-center gap-2 text-xs">
              <AlertCircle className="size-4 shrink-0" />
              <span>{cancelError}</span>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="cancelReason">Alasan Pembatalan</Label>
            <Input
              id="cancelReason"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Contoh: Salah input nominal / Siswa mutasi keluar"
              className="bg-zinc-900 border-zinc-800 text-white"
            />
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-zinc-400">
              Batal
            </Button>
            <Button type="submit" className="bg-rose-600 hover:bg-rose-500 text-white font-semibold">
              Konfirmasi Batalkan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
