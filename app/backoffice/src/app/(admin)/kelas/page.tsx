'use client';

import React, { useState, useEffect } from 'react';
import { GraduationCap, AlertCircle } from 'lucide-react';
import { fetchApi } from '../../../lib/api-client';

// Modular Components
import { AcademicYearDialog } from './components/academic-year-dialog';
import { ClassDialog } from './components/class-dialog';
import { AcademicYearList } from './components/academic-year-list';
import { ClassTable } from './components/class-table';

interface AcademicYear {
  id: string;
  name: string;
  aktif: boolean;
  createdAt: string;
}

interface ClassItem {
  id: string;
  name: string;
  tahunAjaranId: string;
  createdAt: string;
}

export default function KelasPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [classRes, yearRes] = await Promise.all([
        fetchApi<ClassItem[]>('/kelas'),
        fetchApi<AcademicYear[]>('/kelas/tahun-ajaran'),
      ]);

      if (classRes.success && classRes.data) {
        setClasses(classRes.data);
      }
      if (yearRes.success && yearRes.data) {
        setAcademicYears(yearRes.data);
      }
    } catch (e: any) {
      setError(e.message || 'Gagal memuat data akademik.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateYearSuccess = async (newYear: AcademicYear, wasActive: boolean) => {
    if (wasActive) {
      await loadData();
    } else {
      setAcademicYears((prev) => [...prev, newYear]);
    }
  };

  const handleCreateClassSuccess = (newClass: ClassItem) => {
    setClasses((prev) => [...prev, newClass]);
  };

  const handleDeleteClass = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kelas ini?')) return;
    try {
      const res = await fetchApi<ClassItem>(`/kelas/${id}`, {
        method: 'DELETE',
      });
      if (res.success) {
        setClasses((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (e: any) {
      alert(e.message || 'Gagal menghapus kelas.');
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent flex items-center gap-2">
            <GraduationCap className="size-8 text-indigo-400" />
            Manajemen Kelas & Akademik
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Kelola tingkatan kelas dan pengaturan periode tahun ajaran aktif.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AcademicYearDialog onSuccess={handleCreateYearSuccess} />
          <ClassDialog academicYears={academicYears} onSuccess={handleCreateClassSuccess} />
        </div>
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

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: Academic Year List */}
        <AcademicYearList academicYears={academicYears} isLoading={isLoading} />

        {/* Right Side: Classes Table */}
        <div className="md:col-span-2">
          <ClassTable
            classes={classes}
            academicYears={academicYears}
            isLoading={isLoading}
            onDelete={handleDeleteClass}
          />
        </div>
      </div>
    </div>
  );
}
