'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/context/auth-context';
import {
  Button,
  Input,
  Label,
} from '@org/ui';
import {
  Landmark,
  ShieldAlert,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { fetchApi } from '../../../lib/api-client';

interface TenantInfo {
  id: string;
  name: string;
  code: string;
  bankName: string | null;
  bankAccountNumber: string | null;
  bankAccountName: string | null;
  gatewayAccountId: string | null;
}

export default function RekeningPage() {
  const { activeRole } = useAuth();
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [bankName, setBankName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankAccountName, setBankAccountName] = useState('');
  const [gatewayAccountId, setGatewayAccountId] = useState('');

  const loadTenantDetails = async () => {
    if (activeRole !== 'OWNER') {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetchApi<TenantInfo>('/tenant');
      if (res.success && res.data) {
        setTenant(res.data);
        setBankName(res.data.bankName || '');
        setBankAccountNumber(res.data.bankAccountNumber || '');
        setBankAccountName(res.data.bankAccountName || '');
        setGatewayAccountId(res.data.gatewayAccountId || '');
      }
    } catch (e: any) {
      setError(e.message || 'Gagal memuat data rekening.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTenantDetails();
  }, [activeRole]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      const res = await fetchApi<TenantInfo>('/tenant', {
        method: 'PUT',
        body: JSON.stringify({
          name: tenant?.name,
          code: tenant?.code,
          bankName: bankName || null,
          bankAccountNumber: bankAccountNumber || null,
          bankAccountName: bankAccountName || null,
          gatewayAccountId: gatewayAccountId || null,
        }),
      });

      if (res.success && res.data) {
        setSuccess('Pengaturan rekening & payment gateway berhasil disimpan.');
        setTenant(res.data);
      }
    } catch (e: any) {
      setError(e.message || 'Gagal menyimpan pengaturan.');
    } finally {
      setIsSaving(false);
    }
  };

  if (activeRole !== 'OWNER') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="bg-rose-500/5 border border-rose-500/10 p-8 rounded-2xl max-w-md text-center space-y-4 shadow-xl">
          <div className="size-12 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto text-rose-500">
            <ShieldAlert className="size-6" />
          </div>
          <h2 className="text-xl font-bold text-zinc-100">Akses Terbatas</h2>
          <p className="text-zinc-400 text-sm">
            Halaman ini berisi informasi rekening pencairan dana sensitif dan hanya dapat diakses oleh pemilik pesantren (**OWNER**).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent flex items-center gap-2">
          <Landmark className="size-8 text-indigo-400" />
          Rekening & Payment Gateway
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Konfigurasi rekening bank pesantren untuk pencairan dana otomatis dan kredensial Midtrans Sub-Merchant ID.
        </p>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-zinc-500 text-sm">
          Memuat data rekening...
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-start gap-3">
              <AlertCircle className="size-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold">Terjadi Kesalahan</h4>
                <p className="text-sm mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="size-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold">Berhasil Disimpan</h4>
                <p className="text-sm mt-0.5">{success}</p>
              </div>
            </div>
          )}

          {/* Bank details Card */}
          <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
              <Landmark className="size-5 text-indigo-400" />
              Informasi Rekening Bank
            </h3>
            <p className="text-xs text-zinc-500">
              Rekening ini digunakan sebagai tujuan penarikan dana/settlement pembayaran tagihan santri dari Midtrans.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bankName">Nama Bank</Label>
                <Input
                  id="bankName"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Contoh: Bank Syariah Indonesia (BSI)"
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankAccountNumber">Nomor Rekening</Label>
                <Input
                  id="bankAccountNumber"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  placeholder="Contoh: 7149023456"
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankAccountName">Nama Pemilik Rekening</Label>
              <Input
                id="bankAccountName"
                value={bankAccountName}
                onChange={(e) => setBankAccountName(e.target.value)}
                placeholder="Contoh: Yayasan Pesantren Darul Ilmi"
                className="bg-zinc-950 border-zinc-800 text-white"
              />
            </div>
          </div>

          {/* Payment gateway card */}
          <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
              <HelpCircle className="size-5 text-indigo-400" />
              Integrasi Payment Gateway
            </h3>
            <p className="text-xs text-zinc-500">
              Sistem ini mendukung fitur *split billing* otomatis. Masukkan Sub-Merchant ID Midtrans Anda.
            </p>

            <div className="space-y-2">
              <Label htmlFor="gatewayId">Midtrans Sub-Merchant ID</Label>
              <Input
                id="gatewayId"
                value={gatewayAccountId}
                onChange={(e) => setGatewayAccountId(e.target.value)}
                placeholder="Contoh: M012942"
                className="bg-zinc-950 border-zinc-800 text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold gap-2"
            >
              <Save className="size-4" />
              {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
