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
  Input,
  Button
} from '@org/ui';
import { Search, Calendar, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { fetchApi } from '../../../lib/api-client';

interface AuditLogItem {
  id: string;
  actorName: string;
  tenantName: string;
  tenantCode: string;
  action: string;
  details: string;
  createdAt: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [uniqueActions, setUniqueActions] = useState<string[]>([]);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Debounce search query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on query edit
    }, 450);
    return () => clearTimeout(timer);
  }, [search]);

  // Load audit logs from server
  useEffect(() => {
    const loadLogs = async () => {
      try {
        setIsLoading(true);
        const res = await fetchApi<{
          logs: AuditLogItem[];
          total: number;
          page: number;
          limit: number;
          totalPages: number;
          uniqueActions: string[];
        }>(`/superadmin/audit-logs?page=${page}&limit=20&search=${debouncedSearch}&action=${actionFilter}`);

        if (res.success && res.data) {
          setLogs(res.data.logs);
          setTotal(res.data.total);
          setTotalPages(res.data.totalPages || 1);
          if (res.data.uniqueActions) {
            setUniqueActions(res.data.uniqueActions);
          }
        }
      } catch (e: any) {
        setError(e.message || 'Gagal memuat log audit.');
      } finally {
        setIsLoading(false);
      }
    };
    loadLogs();
  }, [page, debouncedSearch, actionFilter]);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">
            Audit Log Global
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Riwayat pencatatan aktivitas administratif, keamanan, dan mutasi data sensitif di seluruh tenant platform.
          </p>
        </div>
        <div className="border border-zinc-800 rounded-xl bg-zinc-900/30 overflow-hidden shadow-lg p-6 space-y-4">
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between border-b border-zinc-800/65 py-4">
                <div className="h-4 w-28 bg-zinc-800 rounded" />
                <div className="h-4 w-40 bg-zinc-800 rounded" />
                <div className="h-4 w-32 bg-zinc-800 rounded" />
                <div className="h-4 w-64 bg-zinc-800 rounded" />
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">
          Audit Log Global
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Riwayat pencatatan aktivitas administratif, keamanan, dan mutasi data sensitif di seluruh tenant platform.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative max-w-xs w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari pelaku, detail, atau aksi..."
              className="pl-9 bg-zinc-900 border-zinc-800 text-white focus-visible:ring-indigo-500/50"
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(1);
            }}
            className="bg-zinc-900 border border-zinc-800 rounded-lg text-xs py-2 px-3 focus:outline-none focus:border-indigo-500 text-zinc-300 font-medium cursor-pointer"
          >
            <option value="ALL">Semua Aksi</option>
            {uniqueActions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-zinc-500 font-mono font-medium">
          Menampilkan {logs.length} dari {total} entri logs
        </div>
      </div>

      {/* Logs Table */}
      <div className="border border-zinc-800 rounded-xl bg-zinc-900/30 overflow-hidden shadow-lg">
        <Table>
          <TableHeader className="bg-zinc-900/80 border-b border-zinc-800">
            <TableRow className="hover:bg-transparent border-zinc-800">
              <TableHead className="text-zinc-400 font-semibold text-xs py-3.5 w-[180px]">Waktu</TableHead>
              <TableHead className="text-zinc-400 font-semibold text-xs py-3.5 w-[200px]">Aktor / Pesantren</TableHead>
              <TableHead className="text-zinc-400 font-semibold text-xs py-3.5 w-[180px]">Jenis Aksi</TableHead>
              <TableHead className="text-zinc-400 font-semibold text-xs py-3.5">Detail Aktivitas</TableHead>
              <TableHead className="text-zinc-400 font-semibold text-xs py-3.5 text-right w-[100px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <TableRow key={log.id} className="border-b border-zinc-800/65 hover:bg-zinc-900/20 transition duration-150">
                  <TableCell className="font-mono text-zinc-400 text-xs py-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-zinc-500" />
                      <span>{new Date(log.createdAt).toLocaleString('id-ID')}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-zinc-200 text-sm flex items-center gap-1.5">
                        <User className="size-3.5 text-zinc-400" />
                        {log.actorName}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-medium pl-5">
                        {log.tenantName} ({log.tenantCode})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800 font-mono text-[10px] font-semibold text-zinc-300">
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell className="text-zinc-300 text-xs py-4 leading-relaxed font-medium">
                    {log.details}
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <Badge className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 text-[9px] font-bold">
                      SUCCESS
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-zinc-500 text-xs font-medium">
                  Tidak ada audit log yang sesuai filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-zinc-500 text-xs font-medium">
          Halaman {page} dari {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white cursor-pointer text-xs"
          >
            <ArrowLeft className="size-3.5 mr-1" /> Sebelum
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white cursor-pointer text-xs"
          >
            Sesudah <ArrowRight className="size-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
