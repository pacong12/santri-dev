import { ITagihanRepository, Tagihan, StatusTagihan, KelasPayment, BillingPeriod, JenisTagihan } from '@org/domain-tagihan';
import { prisma } from '../database.js';

export class PrismaTagihanRepository implements ITagihanRepository {
  async findById(tenantId: string, id: string): Promise<Tagihan | null> {
    const result = await prisma.tagihan.findUnique({
      where: { id, tenantId, deletedAt: null },
    });
    if (!result) return null;
    return {
      ...result,
      status: result.status as StatusTagihan,
    };
  }

  async findAllBySantri(tenantId: string, santriId: string): Promise<Tagihan[]> {
    const results = await prisma.tagihan.findMany({
      where: { tenantId, santriId, deletedAt: null },
    });
    return results.map(r => ({
      ...r,
      status: r.status as StatusTagihan,
    }));
  }

  async create(tenantId: string, data: Omit<Tagihan, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Tagihan> {
    const result = await prisma.tagihan.create({
      data: {
        tenantId,
        santriId: data.santriId,
        jenisTagihanId: data.jenisTagihanId,
        tahunAjaranId: data.tahunAjaranId,
        nama: data.nama,
        amount: data.amount,
        periode: data.periode,
        status: data.status,
        dueDate: data.dueDate,
      },
    });
    return {
      ...result,
      status: result.status as StatusTagihan,
    };
  }

  async update(tenantId: string, id: string, data: Partial<Omit<Tagihan, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'deletedAt'>>): Promise<Tagihan> {
    const result = await prisma.tagihan.update({
      where: { id, tenantId },
      data: {
        jenisTagihanId: data.jenisTagihanId,
        tahunAjaranId: data.tahunAjaranId,
        nama: data.nama,
        amount: data.amount,
        periode: data.periode,
        status: data.status,
        dueDate: data.dueDate,
      },
    });
    return {
      ...result,
      status: result.status as StatusTagihan,
    };
  }

  async delete(tenantId: string, id: string): Promise<Tagihan> {
    const result = await prisma.tagihan.update({
      where: { id, tenantId },
      data: { deletedAt: new Date() },
    });
    return {
      ...result,
      status: result.status as StatusTagihan,
    };
  }

  async findAllByTenant(tenantId: string): Promise<Tagihan[]> {
    const results = await prisma.tagihan.findMany({
      where: { tenantId, deletedAt: null },
    });
    return results.map(r => ({
      ...r,
      status: r.status as StatusTagihan,
    }));
  }

  async findPricingByClass(tenantId: string, kelasId: string): Promise<KelasPayment[]> {
    const results = await prisma.kelasPayment.findMany({
      where: { tenantId, kelasId },
    });
    return results.map(r => ({
      ...r,
      periode: r.periode as BillingPeriod,
    }));
  }

  async findAllPricing(tenantId: string): Promise<KelasPayment[]> {
    const results = await prisma.kelasPayment.findMany({
      where: { tenantId },
    });
    return results.map(r => ({
      ...r,
      periode: r.periode as BillingPeriod,
    }));
  }

  async createPricing(tenantId: string, data: { kelasId: string; jenisTagihanId: string; amount: bigint; periode: string }): Promise<KelasPayment> {
    const result = await prisma.kelasPayment.create({
      data: {
        tenantId,
        kelasId: data.kelasId,
        jenisTagihanId: data.jenisTagihanId,
        amount: data.amount,
        periode: data.periode as any,
      },
    });
    return {
      ...result,
      periode: result.periode as BillingPeriod,
    };
  }

  async findJenisTagihanById(tenantId: string, id: string): Promise<JenisTagihan | null> {
    return prisma.jenisTagihan.findUnique({
      where: { id, tenantId },
    });
  }

  async findJenisTagihanByTenant(tenantId: string): Promise<JenisTagihan[]> {
    return prisma.jenisTagihan.findMany({
      where: { tenantId },
    });
  }

  async createJenisTagihan(tenantId: string, nama: string): Promise<JenisTagihan> {
    return prisma.jenisTagihan.create({
      data: {
        tenantId,
        name: nama,
      },
    });
  }
}
