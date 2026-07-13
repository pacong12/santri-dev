'use client';

import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Button,
} from '@org/ui';
import { Trash2, Mail, User } from 'lucide-react';

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

interface StafTableProps {
  stafList: StafItem[];
  isLoading: boolean;
  onRemove: (userId: string) => void;
}

export function StafTable({ stafList, isLoading, onRemove }: StafTableProps) {
  return (
    <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl overflow-hidden shadow-xl">
      <Table>
        <TableHeader className="bg-zinc-900/50">
          <TableRow className="border-zinc-800">
            <TableHead className="text-zinc-400">Nama Lengkap</TableHead>
            <TableHead className="text-zinc-400">Username</TableHead>
            <TableHead className="text-zinc-400">Email</TableHead>
            <TableHead className="text-zinc-400">Tanggal Ditambahkan</TableHead>
            <TableHead className="text-zinc-400 text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-zinc-500 text-xs">
                Memuat data staf...
              </TableCell>
            </TableRow>
          ) : stafList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-zinc-500 text-xs">
                Belum ada staf admin terdaftar. Klik "Undang Staf" untuk menambahkan.
              </TableCell>
            </TableRow>
          ) : (
            stafList.map((s) => (
              <TableRow key={s.id} className="border-zinc-800/50 hover:bg-zinc-900/20">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                      <User className="size-4" />
                    </div>
                    <span className="font-semibold text-sm text-zinc-200">{s.user.name || 'Admin'}</span>
                  </div>
                </TableCell>
                <TableCell className="text-zinc-400 text-xs">{s.user.username}</TableCell>
                <TableCell className="text-zinc-400 text-xs">
                  <span className="flex items-center gap-1.5">
                    <Mail className="size-3.5 text-zinc-600" />
                    {s.user.email}
                  </span>
                </TableCell>
                <TableCell className="text-zinc-500 text-xs font-mono">
                  {new Date(s.createdAt).toLocaleDateString('id-ID')}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(s.userId)}
                    className="text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 size-8 rounded-lg"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
