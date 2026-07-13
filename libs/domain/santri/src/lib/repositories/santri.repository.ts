import { Santri, Kelas, TahunAjaran, RiwayatKelas } from '../entities/santri.entity.js';

export interface ISantriRepository {
  findById(tenantId: string, id: string): Promise<Santri | null>;
  findByNis(tenantId: string, nis: string): Promise<Santri | null>;
  findAllByTenant(tenantId: string): Promise<Santri[]>;
  create(tenantId: string, data: Omit<Santri, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Santri>;
  update(tenantId: string, id: string, data: Partial<Omit<Santri, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'deletedAt'>>): Promise<Santri>;
  delete(tenantId: string, id: string): Promise<Santri>; // Soft delete
  findClassById(tenantId: string, id: string): Promise<Kelas | null>;
  findClassesByTenant(tenantId: string): Promise<Kelas[]>;
  createClass(tenantId: string, data: { name: string; tahunAjaranId: string }): Promise<Kelas>;
  deleteClass(tenantId: string, id: string): Promise<Kelas>;
  findActiveAcademicYear(tenantId: string): Promise<TahunAjaran | null>;
  findTahunAjaranByTenant(tenantId: string): Promise<TahunAjaran[]>;
  createTahunAjaran(tenantId: string, name: string, aktif: boolean): Promise<TahunAjaran>;
  addHistory(data: Omit<RiwayatKelas, 'id' | 'tanggal'>): Promise<RiwayatKelas>;
}
