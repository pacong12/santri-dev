'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/context/auth-context';
import { PageLayout } from '../../components/page-layout';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Badge,
  Input,
  Button,
} from '@org/ui';
import {
  Search,
  Calendar,
  User,
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  AlertCircle,
} from 'lucide-react';
import { fetchApi } from '../../lib/api-client';

interface AuditLogItem {
  id: string;
  actorName: string;
  tenantName?: string;
  tenantCode?: string;
  action: string;
  details: string;
  createdAt: string;
}

export default function UnifiedAuditLogsPage() {
  const { user } = useAuth();
  const isSuperadmin = user?.platformRole === 'SUPERADMIN';

  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [uniqueActions, setUniqueActions] = useState<string[]>([]);

  // Pagination (For Superadmin)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 450);
    return () => clearTimeout(timer);
  }, [search]);

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (isSuperadmin) {
        // Superadmin Endpoint
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
      } else {
        // Tenant Admin/Owner Endpoint
        const res = await fetchApi<AuditLogItem[]>('/tenant/audit-logs');
        if (res.success && res.data) {
          setLogs(res.data);
          // Local unique actions for filters
          const actions = Array.from(new Set(res.data.map(l => l.action)));
          setUniqueActions(actions);
        }
      }
    } catch (e: any) {
      setError(e.message || 'Gagal memuat log audit.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [page, debouncedSearch, actionFilter, isSuperadmin]);

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'CREATE_TENANT':
      case 'INVITE_ADMIN':
      case 'CREATE_CHECKOUT':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'CANCEL_BILLING':
      case 'REMOVE_ADMIN':
      case 'ARCHIVE_TENANT':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'UPDATE_TENANT_DETAILS':
      case 'UPDATE_SETTINGS':
        return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
      default:
        return 'bg-zinc-800 text-zinc-400 border border-zinc-700';
    }
  };

  // Local filter for tenant admins
  const displayLogs = isSuperadmin
    ? logs
    : logs.filter(log => {
        const matchesSearch = log.details.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          log.action.toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
        return matchesSearch && matchesAction;
      });

  return (
    <PageLayout>
      <div className="space-y-8 animate-in fade-in duration-500 w-full">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent flex items-center gap-2">
            <ClipboardList className="size-8 text-indigo-400" />
            {isSuperadmin ? 'Global Audit Logs' : 'Audit Trail Log'}
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            {isSuperadmin
              ? 'Memantau seluruh aktivitas administratif, audit data sensitif, dan penanganan status pesantren terdaftar.'
              : 'Memantau aktivitas administratif staf, pembatalan tagihan SPP, dan konfigurasi pesantren.'}
          </p>
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

        {/* Filters and search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/20 border border-zinc-800/80 rounded-xl p-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 size-4 text-zinc-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari aktivitas atau pelaku..."
              className="pl-9 bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-zinc-400 text-xs shrink-0">Filter Aksi:</span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">Semua Aksi</option>
              {uniqueActions.map((act) => (
                <option key={act} value={act}>
                  {act.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl overflow-hidden shadow-xl">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-zinc-800">
                <TableHead className="text-zinc-400">Aksi</TableHead>
                <TableHead className="text-zinc-400">Pelaku (Actor)</TableHead>
                {isSuperadmin && <TableHead className="text-zinc-400">Pesantren (Tenant)</TableHead>}
                <TableHead className="text-zinc-400">Detail Aktivitas</TableHead>
                <TableHead className="text-zinc-400">Waktu Kejadian</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={isSuperadmin ? 5 : 4} className="text-center py-12 text-zinc-500 text-xs">
                    Memuat data log...
                  </TableCell>
                </TableRow>
              ) : displayLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isSuperadmin ? 5 : 4} className="text-center py-12 text-zinc-500 text-xs">
                    Belum ada riwayat aktivitas yang terekam.
                  </TableCell>
                </TableRow>
              ) : (
                displayLogs.map((log) => (
                  <TableRow key={log.id} className="border-zinc-800/50 hover:bg-zinc-900/20">
                    <TableCell>
                      <Badge className={`${getActionBadgeColor(log.action)} uppercase text-[9px] tracking-wider font-semibold font-mono`}>
                        {log.action.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1.5 text-zinc-300 text-xs font-medium">
                        <User className="size-3.5 text-zinc-500 shrink-0" />
                        {log.actorName}
                      </span>
                    </TableCell>
                    {isSuperadmin && (
                      <TableCell>
                        <div>
                          <p className="text-zinc-200 text-xs font-medium">{log.tenantName}</p>
                          <p className="text-[9px] text-zinc-500 mt-0.5">Code: {log.tenantCode}</p>
                        </div>
                      </TableCell>
                    )}
                    <TableCell className="text-zinc-200 text-xs max-w-md">
                      {log.details}
                    </TableCell>
                    <TableCell className="text-zinc-500 text-[10px] font-mono whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3 text-zinc-600" />
                        {new Date(log.createdAt).toLocaleString('id-ID')}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination (Only for Superadmin) */}
        {isSuperadmin && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-zinc-800/50 pt-4">
            <div className="text-xs text-zinc-400">
              Menampilkan {displayLogs.length} dari {total} log audit
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 size-8 p-0"
              >
                <ArrowLeft className="size-4" />
              </Button>
              <span className="text-xs text-zinc-300">
                Halaman {page} dari {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 size-8 p-0"
              >
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
