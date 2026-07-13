'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@org/ui';
import { ChevronLeft, GraduationCap, AlertCircle } from 'lucide-react';
import { fetchApi } from '../../../../lib/api-client';

// Modular Components
import { ClassSummaryCard } from './components/class-summary-card';
import { ClassStudentTable } from './components/class-student-table';

interface SantriItem {
  id: string;
  nis: string;
  nama: string;
  namaBapak: string | null;
  namaIbu: string | null;
  alamat: string | null;
  userId: string | null;
}

interface TahunAjaranData {
  id: string;
  name: string;
  aktif: boolean;
}

interface KelasDetail {
  id: string;
  name: string;
  tahunAjaranId: string;
  createdAt: string;
  santri: SantriItem[];
  tahunAjaran?: TahunAjaranData;
}

export default function KelasDetailPage() {
  const params = useParams();
  const router = useRouter();
  const kelasId = params.id as string;

  const [kelas, setKelas] = useState<KelasDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadKelas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetchApi<KelasDetail>(`/kelas/${kelasId}`);
      if (res.success && res.data) {
        setKelas(res.data);
      }
    } catch (e: any) {
      setError(e.message || 'Gagal memuat detail kelas.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadKelas();
  }, [kelasId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-zinc-500 text-sm">Memuat detail kelas...</div>
      </div>
    );
  }

  if (error || !kelas) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="size-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold">Kelas Tidak Ditemukan</h4>
            <p className="text-sm mt-0.5">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* Back navigation + Header */}
      <div className="flex flex-col gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 w-fit gap-1.5"
        >
          <ChevronLeft className="size-4" />
          Kembali ke Manajemen Kelas
        </Button>

        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <GraduationCap className="size-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">
              Detail Kelas
            </h1>
            <p className="text-zinc-500 text-xs mt-0.5">{kelas.name}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Summary card */}
        <div className="lg:col-span-1">
          <ClassSummaryCard
            name={kelas.name}
            tahunAjaranNama={kelas.tahunAjaran?.name}
            tahunAjaranAktif={kelas.tahunAjaran?.aktif}
            studentCount={kelas.santri.length}
            createdAt={kelas.createdAt}
          />
        </div>

        {/* Right: Student Table */}
        <div className="lg:col-span-2">
          <ClassStudentTable students={kelas.santri} isLoading={false} />
        </div>
      </div>
    </div>
  );
}
