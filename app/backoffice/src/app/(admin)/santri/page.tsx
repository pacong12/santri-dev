'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@org/ui';
import { Users, Search, Filter, AlertCircle } from 'lucide-react';
import { fetchApi } from '../../../lib/api-client';

// Modular Components
import { RegisterSantriDialog } from './components/register-santri-dialog';
import { PromoteClassDialog } from './components/promote-class-dialog';
import { LinkParentDialog } from './components/link-parent-dialog';
import { SantriTable } from './components/santri-table';

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
  tahunAjaranId: string;
}

export default function SantriPage() {
  const [students, setStudents] = useState<SantriItem[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');

  // Trigger modals control
  const [isPromoteOpen, setIsPromoteOpen] = useState(false);
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<SantriItem | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [studentRes, classRes] = await Promise.all([
        fetchApi<SantriItem[]>('/santri'),
        fetchApi<ClassItem[]>('/kelas'),
      ]);

      if (studentRes.success && studentRes.data) {
        setStudents(studentRes.data);
      }
      if (classRes.success && classRes.data) {
        setClasses(classRes.data);
      }
    } catch (e: any) {
      setError(e.message || 'Gagal memuat data santri.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRegisterSuccess = (newStudent: SantriItem) => {
    setStudents((prev) => [...prev, newStudent]);
  };

  const handlePromoteClick = (student: SantriItem) => {
    setSelectedStudent(student);
    setIsPromoteOpen(true);
  };

  const handlePromoteSuccess = (studentId: string, newKelasId: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, kelasId: newKelasId } : s))
    );
  };

  const handleLinkClick = (student: SantriItem) => {
    setSelectedStudent(student);
    setIsLinkOpen(true);
  };

  const handleLinkSuccess = (studentId: string, mockUserId: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, userId: mockUserId } : s))
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data santri ini?')) return;
    try {
      const res = await fetchApi<SantriItem>(`/santri/${id}`, {
        method: 'DELETE',
      });
      if (res.success) {
        setStudents((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (e: any) {
      alert(e.message || 'Gagal menghapus santri.');
    }
  };

  // Filter local logic
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.nama.toLowerCase().includes(search.toLowerCase()) ||
      s.nis.toLowerCase().includes(search.toLowerCase());
    const matchesClass = classFilter === 'ALL' || s.kelasId === classFilter;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent flex items-center gap-2">
            <Users className="size-8 text-indigo-400" />
            Direktori Santri & Wali
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Daftarkan murid baru, hubungkan wali murid, dan kelola kenaikan kelas operasional.
          </p>
        </div>

        <RegisterSantriDialog classes={classes} onSuccess={handleRegisterSuccess} />
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="size-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold">Terjadi Kesalahan</h4>
            <p className="text-sm mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/20 border border-zinc-800/80 rounded-xl p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 size-4 text-zinc-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari NIS atau nama santri..."
            className="pl-9 bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-zinc-400 text-xs flex items-center gap-1">
            <Filter className="size-3.5 text-zinc-500" />
            Filter Kelas:
          </span>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">Semua Kelas</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Santri Directory Table */}
      <SantriTable
        students={filteredStudents}
        classes={classes}
        isLoading={isLoading}
        onPromoteClick={handlePromoteClick}
        onLinkClick={handleLinkClick}
        onDeleteClick={handleDelete}
      />

      {/* Controlled Dialogs */}
      <PromoteClassDialog
        isOpen={isPromoteOpen}
        onOpenChange={setIsPromoteOpen}
        student={selectedStudent}
        classes={classes}
        onSuccess={handlePromoteSuccess}
      />

      <LinkParentDialog
        isOpen={isLinkOpen}
        onOpenChange={setIsLinkOpen}
        student={selectedStudent}
        onSuccess={handleLinkSuccess}
      />
    </div>
  );
}
