import { Transaksi } from '../entities/transaksi.entity.js';

export interface ITransaksiRepository {
  findById(tenantId: string, id: string): Promise<Transaksi | null>;
  findByOrderId(tenantId: string, orderId: string): Promise<Transaksi | null>;
  findAllByTenant(tenantId: string): Promise<Transaksi[]>;
  create(tenantId: string, data: Omit<Transaksi, 'id' | 'tenantId' | 'createdAt'>): Promise<Transaksi>;
  update(tenantId: string, id: string, data: Partial<Omit<Transaksi, 'id' | 'tenantId' | 'createdAt'>>): Promise<Transaksi>;
  findManyGlobalPaginated(params: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
  }): Promise<(Transaksi & { tenantName: string; tenantCode: string; santriName: string; santriNis: string; tagihanName: string })[]>;
  countGlobal(params: {
    search?: string;
    status?: string;
  }): Promise<number>;
  aggregateSuccessVolume(): Promise<{ totalSuccessVolume: bigint; totalSuccessPlatformFees: bigint }>;
  findRecentTransactions(take: number): Promise<(Transaksi & { tenantName: string; santriName: string })[]>;
}
