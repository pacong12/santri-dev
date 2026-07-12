'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Badge,
  Button,
  Input,
  Label,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@org/ui';
import {
  School,
  Search,
  Plus,
  Phone,
  Mail,
  Landmark,
  CheckCircle2,
  AlertTriangle,
  Power,
  MoreVertical,
  Copy,
  Trash2,
  Eye,
  Settings2,
  AlertCircle
} from 'lucide-react';
import { fetchApi } from '../../../lib/api-client';

interface TenantItem {
  id: string;
  name: string;
  code: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  phone: string | null;
  emailOfficial: string | null;
  address: string | null;
  bankName: string | null;
  bankAccountNumber: string | null;
  bankAccountName: string | null;
  gatewayAccountId: string | null;
  defaultDueDays: number;
  createdAt: string;
}

export default function TenantsPage() {
  const [tenants, setTenants] = useState<TenantItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED' | 'INACTIVE'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Archive (Soft Delete) states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTenantId, setDeleteTenantId] = useState<string | null>(null);
  const [deleteTenantName, setDeleteTenantName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTenantId, setEditTenantId] = useState<string | null>(null);

  // Form states (Create)
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [phone, setPhone] = useState('');
  const [emailOfficial, setEmailOfficial] = useState('');
  const [address, setAddress] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankAccountName, setBankAccountName] = useState('');
  const [gatewayAccountId, setGatewayAccountId] = useState('');
  const [defaultDueDays, setDefaultDueDays] = useState('7');

  // Form states (Edit)
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmailOfficial, setEditEmailOfficial] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editBankName, setEditBankName] = useState('');
  const [editBankAccountNumber, setEditBankAccountNumber] = useState('');
  const [editBankAccountName, setEditBankAccountName] = useState('');
  const [editGatewayAccountId, setEditGatewayAccountId] = useState('');
  const [editDefaultDueDays, setEditDefaultDueDays] = useState('7');

  const loadTenants = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetchApi<TenantItem[]>('/superadmin/tenants');
      if (res.success && res.data) {
        setTenants(res.data);
      }
    } catch (e: any) {
      setError(e.message || 'Gagal memuat data pesantren.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTenants();
  }, []);

  const filteredTenants = tenants.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.code.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openArchiveModal = (id: string, name: string) => {
    setDeleteTenantId(id);
    setDeleteTenantName(name);
    setIsDeleteOpen(true);
  };

  const handleArchive = async () => {
    if (!deleteTenantId) return;
    try {
      const res = await fetchApi<TenantItem>(`/superadmin/tenants/${deleteTenantId}`, {
        method: 'DELETE',
      });
      if (res.success) {
        setTenants((prev) => prev.filter((t) => t.id !== deleteTenantId));
        setIsDeleteOpen(false);
        setDeleteTenantId(null);
      }
    } catch (e: any) {
      alert(e.message || 'Gagal mengarsipkan pesantren.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;
    setFormError(null);

    try {
      const res = await fetchApi<TenantItem>('/superadmin/tenants', {
        method: 'POST',
        body: JSON.stringify({
          name,
          code: code.toLowerCase().replace(/\s+/g, '-'),
          phone: phone || undefined,
          emailOfficial: emailOfficial || undefined,
          address: address || undefined,
          bankName: bankName || undefined,
          bankAccountNumber: bankAccountNumber || undefined,
          bankAccountName: bankAccountName || undefined,
          gatewayAccountId: gatewayAccountId || undefined,
          defaultDueDays: defaultDueDays ? Number(defaultDueDays) : undefined,
        }),
      });

      if (res.success && res.data) {
        setTenants((prev) => [res.data!, ...prev]);
        setIsOpen(false);

        // Reset Form
        setName('');
        setCode('');
        setPhone('');
        setEmailOfficial('');
        setAddress('');
        setBankName('');
        setBankAccountNumber('');
        setBankAccountName('');
        setGatewayAccountId('');
        setDefaultDueDays('7');
      }
    } catch (e: any) {
      setFormError(e.message || 'Gagal mendaftarkan pesantren.');
    }
  };

  const openEditModal = (t: TenantItem) => {
    setEditTenantId(t.id);
    setEditName(t.name);
    setEditCode(t.code);
    setEditPhone(t.phone || '');
    setEditEmailOfficial(t.emailOfficial || '');
    setEditAddress(t.address || '');
    setEditBankName(t.bankName || '');
    setEditBankAccountNumber(t.bankAccountNumber || '');
    setEditBankAccountName(t.bankAccountName || '');
    setEditGatewayAccountId(t.gatewayAccountId || '');
    setEditDefaultDueDays(String(t.defaultDueDays));
    setFormError(null);
    setIsEditOpen(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTenantId || !editName || !editCode) return;
    setFormError(null);

    try {
      const res = await fetchApi<TenantItem>(`/superadmin/tenants/${editTenantId}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: editName,
          code: editCode.toLowerCase().replace(/\s+/g, '-'),
          phone: editPhone || undefined,
          emailOfficial: editEmailOfficial || undefined,
          address: editAddress || undefined,
          bankName: editBankName || undefined,
          bankAccountNumber: editBankAccountNumber || undefined,
          bankAccountName: editBankAccountName || undefined,
          gatewayAccountId: editGatewayAccountId || undefined,
          defaultDueDays: editDefaultDueDays ? Number(editDefaultDueDays) : undefined,
        }),
      });

      if (res.success && res.data) {
        setTenants((prev) =>
          prev.map((t) => (t.id === editTenantId ? res.data! : t))
        );
        setIsEditOpen(false);
      }
    } catch (e: any) {
      setFormError(e.message || 'Gagal mengubah detail pesantren.');
    }
  };

  const toggleStatus = async (id: string, currentStatus: TenantItem['status']) => {
    const nextStatusMap: Record<TenantItem['status'], TenantItem['status']> = {
      ACTIVE: 'SUSPENDED',
      SUSPENDED: 'INACTIVE',
      INACTIVE: 'ACTIVE',
    };
    const nextStatus = nextStatusMap[currentStatus];

    try {
      const res = await fetchApi<TenantItem>(`/superadmin/tenants/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.success && res.data) {
        setTenants((prev) =>
          prev.map((t) => (t.id === id ? res.data! : t))
        );
      }
    } catch (e: any) {
      alert(e.message || 'Gagal mengubah status pesantren.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">
            Daftar Pesantren
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Manajemen keaktifan, konfigurasi sub-merchant, dan informasi perbankan tenant pesantren.
          </p>
        </div>
        <div className="border border-zinc-800 rounded-xl bg-zinc-900/30 overflow-hidden shadow-lg p-6 space-y-4">
          <div className="flex gap-4">
            <div className="h-9 w-64 bg-zinc-800 rounded-lg animate-pulse" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between border-b border-zinc-800/65 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
                    <div className="h-3 w-16 bg-zinc-800 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-6 w-20 bg-zinc-800 rounded-full animate-pulse" />
                <div className="h-8 w-24 bg-zinc-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">
            Daftar Pesantren
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Manajemen keaktifan, konfigurasi sub-merchant, dan informasi perbankan tenant pesantren.
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium cursor-pointer shadow-lg shadow-indigo-600/20">
              <Plus className="size-4 mr-2" /> Daftarkan Pesantren
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                <School className="size-5 text-indigo-400" />
                Registrasi Tenant Baru
              </DialogTitle>
              <DialogDescription className="text-zinc-400 text-xs">
                Masukkan informasi dasar pesantren dan konfigurasi bank penyalur dana santri.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleRegister} className="space-y-4 py-2">
              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded text-xs">
                  {formError}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tenant-name" className="text-zinc-300 text-xs font-semibold">Nama Pesantren *</Label>
                  <Input
                    id="tenant-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Pondok Pesantren Mambaul Ulum"
                    required
                    className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-indigo-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenant-code" className="text-zinc-300 text-xs font-semibold">Kode Domain (Unique Slug) *</Label>
                  <Input
                    id="tenant-code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="mambaululum"
                    required
                    className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-indigo-500/50 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tenant-phone" className="text-zinc-300 text-xs font-semibold">Nomor Telepon Official</Label>
                  <Input
                    id="tenant-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0812XXXXXXXX"
                    className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-indigo-500/50 text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenant-email" className="text-zinc-300 text-xs font-semibold">Email Resmi</Label>
                  <Input
                    id="tenant-email"
                    type="email"
                    value={emailOfficial}
                    onChange={(e) => setEmailOfficial(e.target.value)}
                    placeholder="info@mambaululum.sch.id"
                    className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-indigo-500/50 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tenant-address" className="text-zinc-300 text-xs font-semibold">Alamat Pesantren</Label>
                <Input
                  id="tenant-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Jl. Raya Timur No. 45, Sleman, Yogyakarta"
                  className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-indigo-500/50 text-xs"
                />
              </div>

              <div className="border-t border-zinc-800/80 pt-3 mt-1">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Informasi Rekening Bank</h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="bank-name" className="text-zinc-400 text-[11px] font-medium">Nama Bank</Label>
                    <Input
                      id="bank-name"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="Bank Syariah Indonesia (BSI)"
                      className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-indigo-500/50 text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="bank-account" className="text-zinc-400 text-[11px] font-medium">Nomor Rekening</Label>
                      <Input
                        id="bank-account"
                        value={bankAccountNumber}
                        onChange={(e) => setBankAccountNumber(e.target.value)}
                        placeholder="7123456789"
                        className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-indigo-500/50 text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="bank-holder" className="text-zinc-400 text-[11px] font-medium">Atas Nama Rekening</Label>
                      <Input
                        id="bank-holder"
                        value={bankAccountName}
                        onChange={(e) => setBankAccountName(e.target.value)}
                        placeholder="Yayasan Mambaul Ulum"
                        className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-indigo-500/50 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="due-days" className="text-zinc-300 text-xs font-semibold">Batas Jatuh Tempo Default (Hari)</Label>
                  <Input
                    id="due-days"
                    type="number"
                    value={defaultDueDays}
                    onChange={(e) => setDefaultDueDays(e.target.value)}
                    placeholder="7"
                    className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-indigo-500/50 text-xs font-mono w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gateway-id" className="text-zinc-300 text-xs font-semibold">ID Sub-Merchant Gateway (Midtrans)</Label>
                  <Input
                    id="gateway-id"
                    value={gatewayAccountId}
                    onChange={(e) => setGatewayAccountId(e.target.value)}
                    placeholder="MID-XXXXXXXXX"
                    className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-indigo-500/50 text-xs font-mono w-full"
                  />
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer"
                >
                  Batal
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer">
                  Simpan Tenant
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                <School className="size-5 text-indigo-400" />
                Ubah Detail Pesantren
              </DialogTitle>
              <DialogDescription className="text-zinc-400 text-xs flex flex-col gap-1">
                <span>Perbarui profil, data rekening bank, dan konfigurasi ID sub-merchant untuk transaksi.</span>
                <span className="text-[10px] text-indigo-400 font-mono select-all">ID: {editTenantId}</span>
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleEdit} className="space-y-4 py-2">
              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded text-xs">
                  {formError}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-tenant-name" className="text-zinc-300 text-xs font-semibold">Nama Pesantren *</Label>
                  <Input
                    id="edit-tenant-name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-indigo-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-tenant-code" className="text-zinc-300 text-xs font-semibold">Kode Domain (Unique Slug) *</Label>
                  <Input
                    id="edit-tenant-code"
                    value={editCode}
                    onChange={(e) => setEditCode(e.target.value)}
                    required
                    className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-indigo-500/50 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-tenant-phone" className="text-zinc-300 text-xs font-semibold">Nomor Telepon Official</Label>
                  <Input
                    id="edit-tenant-phone"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-indigo-500/50 text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-tenant-email" className="text-zinc-300 text-xs font-semibold">Email Resmi</Label>
                  <Input
                    id="edit-tenant-email"
                    type="email"
                    value={editEmailOfficial}
                    onChange={(e) => setEditEmailOfficial(e.target.value)}
                    className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-indigo-500/50 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-tenant-address" className="text-zinc-300 text-xs font-semibold">Alamat Pesantren</Label>
                <Input
                  id="edit-tenant-address"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-indigo-500/50 text-xs"
                />
              </div>

              <div className="border-t border-zinc-800/80 pt-3 mt-1">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Informasi Rekening Bank</h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="edit-bank-name" className="text-zinc-400 text-[11px] font-medium">Nama Bank</Label>
                    <Input
                      id="edit-bank-name"
                      value={editBankName}
                      onChange={(e) => setEditBankName(e.target.value)}
                      className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-indigo-500/50 text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="edit-bank-account" className="text-zinc-400 text-[11px] font-medium">Nomor Rekening</Label>
                      <Input
                        id="edit-bank-account"
                        value={editBankAccountNumber}
                        onChange={(e) => setEditBankAccountNumber(e.target.value)}
                        className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-indigo-500/50 text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="edit-bank-holder" className="text-zinc-400 text-[11px] font-medium">Atas Nama Rekening</Label>
                      <Input
                        id="edit-bank-holder"
                        value={editBankAccountName}
                        onChange={(e) => setEditBankAccountName(e.target.value)}
                        className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-indigo-500/50 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-due-days" className="text-zinc-300 text-xs font-semibold">Batas Jatuh Tempo Default (Hari)</Label>
                  <Input
                    id="edit-due-days"
                    type="number"
                    value={editDefaultDueDays}
                    onChange={(e) => setEditDefaultDueDays(e.target.value)}
                    className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-indigo-500/50 text-xs font-mono w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-gateway-id" className="text-zinc-300 text-xs font-semibold">ID Sub-Merchant Gateway (Midtrans)</Label>
                  <Input
                    id="edit-gateway-id"
                    value={editGatewayAccountId}
                    onChange={(e) => setEditGatewayAccountId(e.target.value)}
                    className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-indigo-500/50 text-xs font-mono w-full"
                  />
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditOpen(false)}
                  className="border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer"
                >
                  Batal
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer">
                  Perbarui Detail
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Mini Stats Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/80 shadow-md">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Total Tenant</span>
          <p className="text-xl font-bold text-zinc-200 mt-0.5">{tenants.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/80 shadow-md">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Tenant Aktif</span>
          <p className="text-xl font-bold text-emerald-400 mt-0.5">{tenants.filter(t => t.status === 'ACTIVE').length}</p>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/80 shadow-md">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Ditangguhkan</span>
          <p className="text-xl font-bold text-amber-400 mt-0.5">{tenants.filter(t => t.status === 'SUSPENDED').length}</p>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/80 shadow-md">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Nonaktif</span>
          <p className="text-xl font-bold text-zinc-400 mt-0.5">{tenants.filter(t => t.status === 'INACTIVE').length}</p>
        </div>
      </div>

      {/* Search & Status Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau kode domain..."
            className="pl-9 bg-zinc-900 border-zinc-800 text-white focus-visible:ring-indigo-500/50"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="bg-zinc-900 border border-zinc-800 rounded-lg text-xs py-2 px-3 focus:outline-none focus:border-indigo-500 text-zinc-300 font-medium cursor-pointer"
        >
          <option value="ALL">Semua Status Keaktifan</option>
          <option value="ACTIVE">ACTIVE (Aktif)</option>
          <option value="SUSPENDED">SUSPENDED (Ditangguhkan)</option>
          <option value="INACTIVE">INACTIVE (Nonaktif)</option>
        </select>
      </div>

      {/* Tenants Table */}
      <div className="border border-zinc-800 rounded-xl bg-zinc-900/30 overflow-hidden shadow-lg">
        <Table>
          <TableHeader className="bg-zinc-900/80 border-b border-zinc-800">
            <TableRow className="hover:bg-transparent border-zinc-800">
              <TableHead className="text-zinc-400 font-semibold text-xs py-3.5 w-[50px] text-center">#</TableHead>
              <TableHead className="text-zinc-400 font-semibold text-xs py-3.5">Pesantren</TableHead>
              <TableHead className="text-zinc-400 font-semibold text-xs py-3.5">Kode Domain</TableHead>
              <TableHead className="text-zinc-400 font-semibold text-xs py-3.5">Status</TableHead>
              <TableHead className="text-zinc-400 font-semibold text-xs py-3.5">Telepon & Email</TableHead>
              <TableHead className="text-zinc-400 font-semibold text-xs py-3.5">Rekening Bank</TableHead>
              <TableHead className="text-zinc-400 font-semibold text-xs py-3.5">Split Routing</TableHead>
              <TableHead className="text-zinc-400 font-semibold text-xs py-3.5">Tanggal Daftar</TableHead>
              <TableHead className="text-zinc-400 font-semibold text-xs py-3.5 text-right w-[60px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTenants.length > 0 ? (
              filteredTenants.map((t, index) => (
                <TableRow key={t.id} className="border-b border-zinc-800/65 hover:bg-zinc-900/30 transition duration-150">
                  <TableCell className="font-mono text-zinc-500 text-xs py-4 text-center">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-semibold text-zinc-200 text-sm py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 font-bold text-xs border border-zinc-700 shrink-0">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <a
                          href={`/tenants/${t.id}`}
                          className="block text-zinc-200 hover:text-indigo-400 transition hover:underline cursor-pointer"
                        >
                          {t.name}
                        </a>
                        <span className="font-mono text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5 select-all">
                          ID: {t.id}
                          <button
                            onClick={() => handleCopy(t.id)}
                            className="text-zinc-600 hover:text-indigo-400 transition p-0.5 cursor-pointer"
                            title="Salin ID Tenant"
                          >
                            {copiedId === t.id ? (
                              <CheckCircle2 className="size-3 text-emerald-500" />
                            ) : (
                              <Copy className="size-3" />
                            )}
                          </button>
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-zinc-400 text-xs py-4">
                    <span className="px-2 py-1 rounded bg-zinc-950 border border-zinc-800/80">
                      {t.code}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    {t.status === 'ACTIVE' && (
                      <Badge className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 font-semibold text-[10px] flex items-center gap-1 w-fit">
                        <CheckCircle2 className="size-3" /> ACTIVE
                      </Badge>
                    )}
                    {t.status === 'SUSPENDED' && (
                      <Badge className="bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 font-semibold text-[10px] flex items-center gap-1 w-fit">
                        <AlertTriangle className="size-3" /> SUSPENDED
                      </Badge>
                    )}
                    {t.status === 'INACTIVE' && (
                      <Badge className="bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-800 font-semibold text-[10px] flex items-center gap-1 w-fit">
                        <Power className="size-3" /> INACTIVE
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-zinc-400 text-xs py-4 space-y-1">
                    <div className="flex items-center gap-1">
                      <Phone className="size-3 text-zinc-500" />
                      <span>{t.phone || '-'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="size-3 text-zinc-500" />
                      <span>{t.emailOfficial || '-'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-400 text-xs py-4 space-y-1">
                    {t.bankName ? (
                      <>
                        <div className="flex items-center gap-1.5 font-medium text-zinc-300">
                          <Landmark className="size-3.5 text-zinc-500" />
                          <span>{t.bankName}</span>
                        </div>
                        <div className="text-[10px] font-mono text-zinc-500">
                          Account: {t.bankAccountNumber} <br />
                          Holder: {t.bankAccountName}
                        </div>
                      </>
                    ) : (
                      <span className="text-zinc-600 font-medium">Belum diatur</span>
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    {t.gatewayAccountId ? (
                      <Badge className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-[10px] flex items-center gap-1 w-fit font-semibold">
                        <CheckCircle2 className="size-3" /> Ready
                      </Badge>
                    ) : (
                      <Badge className="bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-[10px] flex items-center gap-1 w-fit font-semibold">
                        <AlertCircle className="size-3" /> No Gateway ID
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-zinc-400 text-xs py-4">
                    {new Date(t.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white">
                        <DropdownMenuItem onClick={() => window.location.href = `/tenants/${t.id}`} className="cursor-pointer hover:bg-zinc-800">
                          <Eye className="size-4 mr-2" /> Detail Profil
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(t)} className="cursor-pointer hover:bg-zinc-800">
                          <Settings2 className="size-4 mr-2" /> Ubah Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleStatus(t.id, t.status)} className="cursor-pointer hover:bg-zinc-800">
                          <Power className="size-4 mr-2" /> Ubah Status
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="border-zinc-800" />
                        <DropdownMenuItem onClick={() => openArchiveModal(t.id, t.name)} className="text-rose-400 focus:text-rose-400 cursor-pointer hover:bg-zinc-800">
                          <Trash2 className="size-4 mr-2" /> Arsipkan Tenant
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10 text-zinc-500 text-xs font-medium">
                  Tidak ada pesantren yang ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Archive Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <Trash2 className="size-5 text-rose-500" />
              Arsip Pesantren
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs mt-2 leading-relaxed">
              Apakah Anda yakin ingin mengarsipkan pesantren <span className="font-semibold text-zinc-200">{deleteTenantName}</span>?
              Aksi ini akan menonaktifkan pesantren dari portal utama secara permanen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4 flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleArchive}
              className="bg-rose-600 hover:bg-rose-500 text-white cursor-pointer"
            >
              Arsipkan Pesantren
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
