import { Tagihan, KelasPayment, JenisTagihan } from '../entities/tagihan.entity.js';

export interface ITagihanRepository {
  findById(tenantId: string, id: string): Promise<Tagihan | null>;
  findAllBySantri(tenantId: string, santriId: string): Promise<Tagihan[]>;
  create(tenantId: string, data: Omit<Tagihan, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Tagihan>;
  update(tenantId: string, id: string, data: Partial<Omit<Tagihan, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'deletedAt'>>): Promise<Tagihan>;
  delete(tenantId: string, id: string): Promise<Tagihan>; // Soft delete
  findPricingByClass(tenantId: string, kelasId: string): Promise<KelasPayment[]>;
  findJenisTagihanById(tenantId: string, id: string): Promise<JenisTagihan | null>;
}
