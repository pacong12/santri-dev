import { Tenant } from '../entities/tenant.entity.js';

export interface ITenantRepository {
  findById(id: string): Promise<Tenant | null>;
  findByCode(code: string): Promise<Tenant | null>;
  create(data: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Tenant>;
  update(id: string, data: Partial<Omit<Tenant, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>): Promise<Tenant>;
  delete(id: string): Promise<Tenant>; // Soft delete
  findManyActive(): Promise<Tenant[]>;
  countActive(): Promise<number>;
  countAll(): Promise<number>;
  getTenantMetrics(id: string): Promise<{ santriCount: number; kelasCount: number; tagihanCount: number }>;
  findRecentTenants(take: number): Promise<Tenant[]>;
}
