'use client';

import React, { useState, useEffect } from 'react';
import { Receipt, AlertCircle } from 'lucide-react';
import { fetchApi } from '../../../lib/api-client';

// Modular Components
import { BillingTypeDialog } from './components/billing-type-dialog';
import { PricingTemplateDialog } from './components/pricing-template-dialog';
import { BulkReleaseDialog } from './components/bulk-release-dialog';
import { CancelBillingDialog } from './components/cancel-billing-dialog';
import { PricingList } from './components/pricing-list';
import { BillingTable } from './components/billing-table';

interface TagihanItem {
  id: string;
  santriId: string;
  jenisTagihanId: string;
  tahunAjaranId: string | null;
  nama: string;
  amount: number | string;
  periode: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  dueDate: string;
  createdAt: string;
}

interface PricingItem {
  id: string;
  kelasId: string;
  jenisTagihanId: string;
  amount: number | string;
  periode: string;
}

interface JenisTagihan {
  id: string;
  name: string;
}

interface ClassItem {
  id: string;
  name: string;
}

interface AcademicYear {
  id: string;
  name: string;
  aktif: boolean;
}

export default function TagihanPage() {
  const [bills, setBills] = useState<TagihanItem[]>([]);
  const [pricings, setPricings] = useState<PricingItem[]>([]);
  const [types, setTypes] = useState<JenisTagihan[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Status Filter state
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'PAID' | 'CANCELLED'>('ALL');

  // Cancel form states
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [cancelBillId, setCancelBillId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [billsRes, pricingRes, jenisRes, classRes, yearRes] = await Promise.all([
        fetchApi<TagihanItem[]>('/tagihan'),
        fetchApi<PricingItem[]>('/tagihan/pricing'),
        fetchApi<JenisTagihan[]>('/tagihan/jenis'),
        fetchApi<ClassItem[]>('/kelas'),
        fetchApi<AcademicYear[]>('/kelas/tahun-ajaran'),
      ]);

      if (billsRes.success && billsRes.data) {
        setBills(billsRes.data);
      }
      if (pricingRes.success && pricingRes.data) {
        setPricings(pricingRes.data);
      }
      if (jenisRes.success && jenisRes.data) {
        setTypes(jenisRes.data);
      }
      if (classRes.success && classRes.data) {
        setClasses(classRes.data);
      }
      if (yearRes.success && yearRes.data) {
        setYears(yearRes.data);
      }
    } catch (e: any) {
      setError(e.message || 'Gagal memuat data keuangan.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancelClick = (billId: string) => {
    setCancelBillId(billId);
    setIsCancelOpen(true);
  };

  const handleCancelSuccess = (billId: string) => {
    setBills((prev) =>
      prev.map((b) => (b.id === billId ? { ...b, status: 'CANCELLED' } : b))
    );
  };

  // Filter bills local logic
  const filteredBills = bills.filter((b) => {
    return statusFilter === 'ALL' || b.status === statusFilter;
  });

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent flex items-center gap-2">
            <Receipt className="size-8 text-indigo-400" />
            Tarif & Billing Engine
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Terbitkan tagihan bulanan santri (SPP) dan kelola daftar tarif nominal biaya operasional.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <BillingTypeDialog onSuccess={(newType) => setTypes((prev) => [...prev, newType])} />
          <PricingTemplateDialog
            classes={classes}
            types={types}
            onSuccess={(newPricing) => setPricings((prev) => [...prev, newPricing])}
          />
          <BulkReleaseDialog classes={classes} years={years} onSuccess={loadData} />
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
      <div className="grid gap-8 md:grid-cols-3">
        {/* Left column: active price settings list */}
        <PricingList pricings={pricings} classes={classes} types={types} isLoading={isLoading} />

        {/* Right column: billing log list */}
        <div className="md:col-span-2">
          <BillingTable
            bills={filteredBills}
            isLoading={isLoading}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onCancelClick={handleCancelClick}
          />
        </div>
      </div>

      {/* Cancellation Dialog (Audit Log) */}
      <CancelBillingDialog
        isOpen={isCancelOpen}
        onOpenChange={setIsCancelOpen}
        billId={cancelBillId}
        onSuccess={handleCancelSuccess}
      />
    </div>
  );
}
