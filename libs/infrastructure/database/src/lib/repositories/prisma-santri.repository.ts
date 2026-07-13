import { ISantriRepository, Santri, Kelas, TahunAjaran, RiwayatKelas } from '@org/domain-santri';
import { prisma } from '../database.js';

export class PrismaSantriRepository implements ISantriRepository {
  async findById(tenantId: string, id: string): Promise<Santri | null> {
    return prisma.santri.findUnique({
      where: { id, tenantId, deletedAt: null },
    });
  }

  async findByNis(tenantId: string, nis: string): Promise<Santri | null> {
    return prisma.santri.findUnique({
      where: {
        tenantId_nis: {
          tenantId,
          nis,
        },
        deletedAt: null,
      },
    });
  }

  async findAllByTenant(tenantId: string): Promise<Santri[]> {
    return prisma.santri.findMany({
      where: { tenantId, deletedAt: null },
    });
  }

  async create(tenantId: string, data: Omit<Santri, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Santri> {
    return prisma.santri.create({
      data: {
        tenantId,
        userId: data.userId,
        kelasId: data.kelasId,
        nis: data.nis,
        nama: data.nama,
        namaBapak: data.namaBapak,
        namaIbu: data.namaIbu,
        alamat: data.alamat,
      },
    });
  }

  async update(tenantId: string, id: string, data: Partial<Omit<Santri, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'deletedAt'>>): Promise<Santri> {
    return prisma.santri.update({
      where: { id, tenantId },
      data: {
        userId: data.userId,
        kelasId: data.kelasId,
        nis: data.nis,
        nama: data.nama,
        namaBapak: data.namaBapak,
        namaIbu: data.namaIbu,
        alamat: data.alamat,
      },
    });
  }

  async delete(tenantId: string, id: string): Promise<Santri> {
    return prisma.santri.update({
      where: { id, tenantId },
      data: { deletedAt: new Date() },
    });
  }

  async findClassById(tenantId: string, id: string): Promise<Kelas | null> {
    return prisma.kelas.findUnique({
      where: { id, tenantId, deletedAt: null },
    });
  }

  async findClassesByTenant(tenantId: string): Promise<Kelas[]> {
    return prisma.kelas.findMany({
      where: { tenantId, deletedAt: null },
    });
  }

  async createClass(tenantId: string, data: { name: string; tahunAjaranId: string }): Promise<Kelas> {
    return prisma.kelas.create({
      data: {
        tenantId,
        name: data.name,
        tahunAjaranId: data.tahunAjaranId,
      },
    });
  }

  async deleteClass(tenantId: string, id: string): Promise<Kelas> {
    return prisma.kelas.update({
      where: { id, tenantId },
      data: { deletedAt: new Date() },
    });
  }

  async findActiveAcademicYear(tenantId: string): Promise<TahunAjaran | null> {
    return prisma.tahunAjaran.findFirst({
      where: { tenantId, aktif: true },
    });
  }

  async findTahunAjaranByTenant(tenantId: string): Promise<TahunAjaran[]> {
    return prisma.tahunAjaran.findMany({
      where: { tenantId },
    });
  }

  async createTahunAjaran(tenantId: string, name: string, aktif: boolean): Promise<TahunAjaran> {
    if (aktif) {
      await prisma.tahunAjaran.updateMany({
        where: { tenantId },
        data: { aktif: false },
      });
    }
    return prisma.tahunAjaran.create({
      data: {
        tenantId,
        name,
        aktif,
      },
    });
  }

  async addHistory(data: Omit<RiwayatKelas, 'id' | 'tanggal'>): Promise<RiwayatKelas> {
    return prisma.riwayatKelas.create({
      data: {
        tenantId: data.tenantId,
        santriId: data.santriId,
        kelasLamaId: data.kelasLamaId,
        kelasBaruId: data.kelasBaruId,
      },
    });
  }

  async findHistoryBySantri(tenantId: string, santriId: string): Promise<RiwayatKelas[]> {
    return prisma.riwayatKelas.findMany({
      where: { tenantId, santriId },
      orderBy: { tanggal: 'desc' },
    });
  }

  async findClassWithStudents(tenantId: string, kelasId: string): Promise<(Kelas & { santri: Santri[] }) | null> {
    const result = await prisma.kelas.findUnique({
      where: { id: kelasId, tenantId, deletedAt: null },
      include: {
        santri: {
          where: { deletedAt: null },
          orderBy: { nama: 'asc' },
        },
      },
    });
    return result as (Kelas & { santri: Santri[] }) | null;
  }
}
