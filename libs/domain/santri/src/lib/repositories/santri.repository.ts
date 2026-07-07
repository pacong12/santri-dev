import { Santri, Kelas, TahunAjaran, RiwayatKelas } from '../entities/santri.entity.js';

export interface ISantriRepository {
  findById(tenantId: string, id: string): Promise<Santri | null>;
  findByNis(tenantId: string, nis: string): Promise<Santri | null>;
  findAllByTenant(tenantId: string): Promise<Santri[]>;
  create(tenantId: string, data: Omit<Santri, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Santri>;
  update(tenantId: string, id: string, data: Partial<Omit<Santri, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'deletedAt'>>): Promise<Santri>;
  delete(tenantId: string, id: string): Promise<Santri>; // Soft delete
  findClassById(tenantId: string, id: string): Promise<Kelas | null>;
  findActiveAcademicYear(tenantId: string): Promise<TahunAjaran | null>;
  addHistory(data: Omit<RiwayatKelas, 'id' | 'tanggal'>): Promise<RiwayatKelas>;
}
