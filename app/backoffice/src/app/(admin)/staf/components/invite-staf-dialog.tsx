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
import { Plus, AlertCircle } from 'lucide-react';
import { fetchApi } from '../../../../lib/api-client';

interface StafUser {
  id: string;
  username: string;
  email: string;
  name: string | null;
}

interface StafItem {
  id: string;
  userId: string;
  role: string;
  createdAt: string;
  user: StafUser;
}

interface InviteStafDialogProps {
  onSuccess: () => void;
}

export function InviteStafDialog({ onSuccess }: InviteStafDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [inviteError, setInviteError] = useState<string | null>(null);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError(null);
    if (!email.trim() || !name.trim() || !username.trim()) {
      setInviteError('Semua field wajib diisi.');
      return;
    }

    try {
      const res = await fetchApi<StafItem>('/tenant/staf', {
        method: 'POST',
        body: JSON.stringify({ email, name, username }),
      });

      if (res.success) {
        onSuccess();
        setEmail('');
        setName('');
        setUsername('');
        setIsOpen(false);
      }
    } catch (e: any) {
      setInviteError(e.message || 'Gagal mengundang staf admin.');
    }
  };

  const setIsOpening = (val: boolean) => {
    setIsOpen(val);
    if (!val) {
      setInviteError(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpening}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold gap-2 self-start md:self-auto">
          <Plus className="size-4" />
          Undang Staf
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle>Undang Staf Administrator</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Masukkan informasi untuk memberikan hak akses admin baru.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleInvite} className="space-y-4 py-2">
          {inviteError && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg flex items-center gap-2 text-xs">
              <AlertCircle className="size-4 shrink-0" />
              <span>{inviteError}</span>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="stafName">Nama Lengkap</Label>
            <Input
              id="stafName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Muhammad Yusuf"
              className="bg-zinc-900 border-zinc-800 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stafUsername">Username</Label>
            <Input
              id="stafUsername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Contoh: yusuf_admin"
              className="bg-zinc-900 border-zinc-800 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stafEmail">Email</Label>
            <Input
              id="stafEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Contoh: yusuf@pesantren.com"
              className="bg-zinc-900 border-zinc-800 text-white"
            />
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsOpening(false)} className="text-zinc-400">
              Batal
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
              Undang Staf
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
