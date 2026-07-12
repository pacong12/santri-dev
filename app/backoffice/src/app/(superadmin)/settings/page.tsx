'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input, Label } from '@org/ui';
import { Settings, ShieldAlert, Sparkles, HelpCircle, Save, Info } from 'lucide-react';
import { fetchApi } from '../../../lib/api-client';

export default function SaaSConfigPage() {
  const [platformFee, setPlatformFee] = useState('5000');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const res = await fetchApi<{ transactionFee: number }>('/superadmin/settings');
        if (res.success && res.data) {
          setPlatformFee(String(res.data.transactionFee));
        }
      } catch (e: any) {
        setError(e.message || 'Gagal memuat pengaturan.');
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError(null);
    try {
      const res = await fetchApi<{ transactionFee: number }>('/superadmin/settings', {
        method: 'PUT',
        body: JSON.stringify({ transactionFee: Number(platformFee) }),
      });
      if (res.success && res.data) {
        setPlatformFee(String(res.data.transactionFee));
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (e: any) {
      setFormError(e.message || 'Gagal menyimpan pengaturan.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 animate-in fade-in duration-500 max-w-4xl mx-auto w-full">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">
            SaaS & Platform Settings
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Pengaturan tarif komisi transaksi, batas sistem, dan integrasi penagihan global.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3 mt-4">
          <div className="md:col-span-2 h-64 bg-zinc-900/30 border border-zinc-800 rounded-xl animate-pulse" />
          <div className="h-64 bg-zinc-900/30 border border-zinc-800 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 animate-in fade-in duration-500 max-w-4xl mx-auto w-full">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">
          SaaS & Platform Settings
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Pengaturan tarif komisi transaksi, batas sistem, dan integrasi penagihan global.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Configurations Form */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSave}>
            <Card className="bg-zinc-900/40 border-zinc-800 text-white shadow-lg">
              {formError && (
                <div className="mx-6 mt-6 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded text-xs">
                  {formError}
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
                  <Settings className="size-4 text-indigo-400" />
                  Konfigurasi Tarif Transaksi Platform
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Besaran flat fee platform yang dibebankan kepada wali santri (Student-Borne Fee) per transaksi sukses.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="platform-fee" className="text-zinc-300 text-sm font-semibold">Biaya Layanan Platform (Platform Fee) *</Label>
                    <span className="text-[10px] text-zinc-500 font-mono">Dikalikan per invoice tagihan</span>
                  </div>
                  <div className="relative max-w-xs">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-semibold">Rp</span>
                    <Input
                      id="platform-fee"
                      value={platformFee}
                      onChange={(e) => setPlatformFee(e.target.value)}
                      placeholder="5000"
                      className="pl-9 bg-zinc-950 border-zinc-800 text-white text-sm font-mono w-full focus-visible:ring-indigo-500/50"
                      required
                    />
                  </div>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    Setiap pembayaran tagihan santri akan dipecah secara otomatis (Split Payment). Biaya platform ini ditambahkan di atas nilai tagihan sekolah dan MDR payment gateway.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t border-zinc-800/80 pt-4 bg-zinc-950/20 px-6">
                <div>
                  {showSuccess && (
                    <span className="text-emerald-400 text-xs font-semibold animate-pulse">
                      ✓ Konfigurasi berhasil diperbarui!
                    </span>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer px-5 font-semibold"
                >
                  {isSaving ? 'Menyimpan...' : (
                    <span className="flex items-center gap-2">
                      <Save className="size-4" /> Simpan Pengaturan
                    </span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>

          {/* System info */}
          <Card className="bg-zinc-900/20 border-zinc-800 text-white">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="size-4" /> Catatan Rekonsiliasi Gateway
              </CardTitle>
            </CardHeader>
            <CardContent className="text-zinc-500 text-xs leading-relaxed space-y-2">
              <p>
                1. Biaya transaksi di atas akan dieksekusi di level router payment gateway (Midtrans SNAP API).
              </p>
              <p>
                2. Pastikan sub-merchant ID masing-masing pesantren sudah diatur dengan skema split payment ke rekening yayasan pesantren dan escrow account SaaS ini.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Calculation Simulation Panel */}
        <div className="space-y-6">
          <Card className="bg-zinc-900/60 border-zinc-800 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 text-zinc-700/50">
              <Sparkles className="size-16 rotate-12" />
            </div>
            <CardHeader>
              <CardTitle className="text-base font-bold text-zinc-200">
                Simulasi Split Payment
              </CardTitle>
              <CardDescription className="text-zinc-400 text-xs">
                Perhitungan total bayar wali santri (MDR + Platform Fee ditanggung santri).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs font-sans border-t border-zinc-800 pt-4">
              <div className="flex justify-between items-center text-zinc-400">
                <span>Nilai Tagihan SPP:</span>
                <span className="font-semibold text-zinc-300">Rp 300.000</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>Biaya Platform (SaaS Fee):</span>
                <span className="font-semibold text-zinc-300">
                  + Rp {Number(platformFee).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>Biaya Gateway (MDR - VA)*:</span>
                <span className="font-semibold text-zinc-300">+ Rp 4.000</span>
              </div>
              <div className="border-t border-zinc-800/80 my-2 pt-2 flex justify-between items-center text-sm font-bold">
                <span className="text-zinc-300">Total Bayar Wali Santri:</span>
                <span className="text-indigo-400">
                  Rp {(300000 + (Number(platformFee) || 0) + 4000).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="border-t border-zinc-800/80 pt-2 flex justify-between items-center text-[11px] text-zinc-500 font-medium">
                <span>Net Diterima Pesantren:</span>
                <span className="text-emerald-400 font-semibold">Rp 300.000 (100% utuh)</span>
              </div>
            </CardContent>
            <CardFooter className="bg-zinc-950/30 px-6 py-3 text-[10px] text-zinc-500 border-t border-zinc-800/60 leading-normal flex items-start gap-2">
              <HelpCircle className="size-3.5 text-zinc-500 shrink-0 mt-0.5" />
              <span>* Biaya gateway disimulasikan menggunakan nominal Virtual Account flat (MDR Rp 4.000).</span>
            </CardFooter>
          </Card>

          <Card className="bg-amber-500/5 border-amber-500/20 text-amber-200/90 p-4 rounded-xl flex gap-3 items-start">
            <ShieldAlert className="size-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="font-bold text-xs">Peringatan Audit Log</h5>
              <p className="text-[10px] text-amber-400/80 leading-relaxed">
                Setiap perubahan biaya platform SaaS ini akan dicatat ke dalam Log Audit Global secara permanen untuk mematuhi kepatuhan audit keuangan platform.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
