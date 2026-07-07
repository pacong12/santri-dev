import { Transaksi } from '../entities/transaksi.entity.js';

export interface ITransaksiRepository {
  findById(tenantId: string, id: string): Promise<Transaksi | null>;
  findByOrderId(tenantId: string, orderId: string): Promise<Transaksi | null>;
  findAllByTenant(tenantId: string): Promise<Transaksi[]>;
  create(tenantId: string, data: Omit<Transaksi, 'id' | 'tenantId' | 'createdAt'>): Promise<Transaksi>;
  update(tenantId: string, id: string, data: Partial<Omit<Transaksi, 'id' | 'tenantId' | 'createdAt'>>): Promise<Transaksi>;
}
