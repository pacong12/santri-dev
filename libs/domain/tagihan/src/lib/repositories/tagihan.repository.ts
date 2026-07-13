import { Tagihan, KelasPayment, JenisTagihan } from '../entities/tagihan.entity.js';

export interface ITagihanRepository {
  findById(tenantId: string, id: string): Promise<Tagihan | null>;
  findAllBySantri(tenantId: string, santriId: string): Promise<Tagihan[]>;
  findAllByTenant(tenantId: string): Promise<Tagihan[]>;
  create(tenantId: string, data: Omit<Tagihan, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Tagihan>;
  update(tenantId: string, id: string, data: Partial<Omit<Tagihan, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'deletedAt'>>): Promise<Tagihan>;
  delete(tenantId: string, id: string): Promise<Tagihan>; // Soft delete
  findPricingByClass(tenantId: string, kelasId: string): Promise<KelasPayment[]>;
  findAllPricing(tenantId: string): Promise<KelasPayment[]>;
  createPricing(tenantId: string, data: { kelasId: string; jenisTagihanId: string; amount: bigint; periode: string }): Promise<KelasPayment>;
  findJenisTagihanById(tenantId: string, id: string): Promise<JenisTagihan | null>;
  findJenisTagihanByTenant(tenantId: string): Promise<JenisTagihan[]>;
  createJenisTagihan(tenantId: string, nama: string): Promise<JenisTagihan>;
}
