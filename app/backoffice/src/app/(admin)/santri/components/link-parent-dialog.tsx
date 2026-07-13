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
  Input,
} from '@org/ui';
import { AlertCircle } from 'lucide-react';

interface SantriItem {
  id: string;
  nis: string;
  nama: string;
  kelasId: string;
}

interface LinkParentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  student: SantriItem | null;
  onSuccess: (studentId: string, mockUserId: string) => void;
}

export function LinkParentDialog({
  isOpen,
  onOpenChange,
  student,
  onSuccess,
}: LinkParentDialogProps) {
  const [linkEmail, setLinkEmail] = useState('');
  const [linkError, setLinkError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setLinkEmail('');
      setLinkError(null);
    }
  }, [isOpen]);

  const handleLinkParent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinkError(null);
    if (!student || !linkEmail.trim()) {
      setLinkError('Email wali tidak boleh kosong.');
      return;
    }

    try {
      // Simulate/Trigger link email in backend
      onSuccess(student.id, 'mock-wali-id');
      onOpenChange(false);
    } catch (e: any) {
      setLinkError(e.message || 'Gagal menautkan wali murid.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle>Tautkan Wali Murid</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Hubungkan akun wali murid ke data santri **{student?.nama}** via email.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLinkParent} className="space-y-4 py-2">
          {linkError && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg flex items-center gap-2 text-xs">
              <AlertCircle className="size-4 shrink-0" />
              <span>{linkError}</span>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="linkEmail">Alasan / Email Wali</Label>
            <Input
              id="linkEmail"
              type="email"
              value={linkEmail}
              onChange={(e) => setLinkEmail(e.target.value)}
              placeholder="Contoh: wali.ahmad@email.com"
              className="bg-zinc-900 border-zinc-800 text-white"
            />
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-zinc-400">
              Batal
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
              Tautkan Akun
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
