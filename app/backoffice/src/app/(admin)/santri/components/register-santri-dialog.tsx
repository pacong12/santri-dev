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

interface SantriItem {
  id: string;
  nis: string;
  nama: string;
  kelasId: string;
  namaBapak: string | null;
  namaIbu: string | null;
  alamat: string | null;
  userId: string | null;
}

interface ClassItem {
  id: string;
  name: string;
}

interface RegisterSantriDialogProps {
  classes: ClassItem[];
  onSuccess: (newStudent: SantriItem) => void;
}

export function RegisterSantriDialog({ classes, onSuccess }: RegisterSantriDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [nis, setNis] = useState('');
  const [nama, setNama] = useState('');
  const [kelasId, setKelasId] = useState('');
  const [namaBapak, setNamaBapak] = useState('');
  const [namaIbu, setNamaIbu] = useState('');
  const [alamat, setAlamat] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Sync initial select
  useEffect(() => {
    if (classes.length > 0 && !kelasId) {
      setKelasId(classes[0].id);
    }
  }, [classes]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!nis.trim() || !nama.trim() || !kelasId) {
      setFormError('NIS, Nama, dan Kelas wajib diisi.');
      return;
    }

    try {
      const res = await fetchApi<SantriItem>('/santri', {
        method: 'POST',
        body: JSON.stringify({
          nis,
          nama,
          kelasId,
          namaBapak: namaBapak || null,
          namaIbu: namaIbu || null,
          alamat: alamat || null,
        }),
      });

      if (res.success && res.data) {
        onSuccess(res.data);
        setNis('');
        setNama('');
        setNamaBapak('');
        setNamaIbu('');
        setAlamat('');
        setIsOpen(false);
      }
    } catch (e: any) {
      setFormError(e.message || 'Gagal meregistrasi santri baru.');
    }
  };

  const setIsOpening = (val: boolean) => {
    setIsOpen(val);
    if (!val) {
      setFormError(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpening}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold gap-2 self-start md:self-auto">
          <Plus className="size-4" />
          Registrasi Santri
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Registrasi Santri Baru</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Lengkapi formulir di bawah ini untuk mendaftarkan siswa baru.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleRegister} className="space-y-4 py-2">
          {formError && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg flex items-center gap-2 text-xs">
              <AlertCircle className="size-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nis">NIS (Nomor Induk)</Label>
              <Input
                id="nis"
                value={nis}
                onChange={(e) => setNis(e.target.value)}
                placeholder="Contoh: 12049"
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kelasSelect">Kelas</Label>
              <select
                id="kelasSelect"
                value={kelasId}
                onChange={(e) => setKelasId(e.target.value)}
                className="w-full h-9 rounded-lg bg-zinc-900 border border-zinc-800 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="nama">Nama Lengkap Santri</Label>
            <Input
              id="nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Ahmad Yani"
              className="bg-zinc-900 border-zinc-800 text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="namaBapak">Nama Ayah</Label>
              <Input
                id="namaBapak"
                value={namaBapak}
                onChange={(e) => setNamaBapak(e.target.value)}
                placeholder="Nama Ayah"
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="namaIbu">Nama Ibu</Label>
              <Input
                id="namaIbu"
                value={namaIbu}
                onChange={(e) => setNamaIbu(e.target.value)}
                placeholder="Nama Ibu"
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="alamat">Alamat Lengkap</Label>
            <Input
              id="alamat"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              placeholder="Contoh: Jl. Diponegoro No. 12, Sleman"
              className="bg-zinc-900 border-zinc-800 text-white"
            />
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsOpening(false)} className="text-zinc-400">
              Batal
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
              Simpan Santri
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
