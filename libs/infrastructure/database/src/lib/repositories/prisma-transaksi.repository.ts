import { ITransaksiRepository, Transaksi, StatusTransaksi } from '@org/domain-transaksi';
import { prisma, Prisma } from '../database.js';

export class PrismaTransaksiRepository implements ITransaksiRepository {
  async findById(tenantId: string, id: string): Promise<Transaksi | null> {
    const result = await prisma.transaksi.findFirst({
      where: { id, tenantId },
    });
    if (!result) return null;
    return {
      ...result,
      status: result.status as StatusTransaksi,
      gatewayResponse: result.gatewayResponse as any,
    };
  }

  async findByOrderId(tenantId: string, orderId: string): Promise<Transaksi | null> {
    const result = await prisma.transaksi.findFirst({
      where: { orderId, tenantId },
    });
    if (!result) return null;
    return {
      ...result,
      status: result.status as StatusTransaksi,
      gatewayResponse: result.gatewayResponse as any,
    };
  }

  async findAllByTenant(tenantId: string): Promise<Transaksi[]> {
    const results = await prisma.transaksi.findMany({
      where: { tenantId },
    });
    return results.map(r => ({
      ...r,
      status: r.status as StatusTransaksi,
      gatewayResponse: r.gatewayResponse as any,
    }));
  }

  async create(tenantId: string, data: Omit<Transaksi, 'id' | 'tenantId' | 'createdAt'>): Promise<Transaksi> {
    const result = await prisma.transaksi.create({
      data: {
        tenantId,
        santriId: data.santriId,
        tagihanId: data.tagihanId,
        amount: data.amount,
        platformFee: data.platformFee,
        gatewayFee: data.gatewayFee,
        netAmount: data.netAmount,
        status: data.status,
        paymentMethod: data.paymentMethod,
        gateway: data.gateway,
        gatewayReference: data.gatewayReference,
        gatewayResponse: data.gatewayResponse as any,
        paidAt: data.paidAt,
        orderId: data.orderId,
      },
    });
    return {
      ...result,
      status: result.status as StatusTransaksi,
      gatewayResponse: result.gatewayResponse as any,
    };
  }

  async update(tenantId: string, id: string, data: Partial<Omit<Transaksi, 'id' | 'tenantId' | 'createdAt'>>): Promise<Transaksi> {
    const tx = await prisma.transaksi.findFirst({
      where: { id, tenantId },
    });
    if (!tx) {
      throw new Error('Transaction not found or unauthorized');
    }

    const result = await prisma.transaksi.update({
      where: { id },
      data: {
        status: data.status,
        paymentMethod: data.paymentMethod,
        gatewayReference: data.gatewayReference,
        gatewayResponse: data.gatewayResponse as any,
        paidAt: data.paidAt,
      },
    });
    return {
      ...result,
      status: result.status as StatusTransaksi,
      gatewayResponse: result.gatewayResponse as any,
    };
  }

  async findManyGlobalPaginated(params: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
  }): Promise<(Transaksi & { tenantName: string; tenantCode: string; santriName: string; santriNis: string; tagihanName: string })[]> {
    const { page, limit, search, status } = params;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.TransaksiWhereInput = {};
    if (status && status !== 'ALL') {
      whereClause.status = status as StatusTransaksi;
    }

    if (search) {
      whereClause.OR = [
        { orderId: { contains: search, mode: 'insensitive' } },
        {
          santri: {
            nama: { contains: search, mode: 'insensitive' },
          },
        },
        {
          tenant: {
            name: { contains: search, mode: 'insensitive' },
          },
        },
      ];
    }

    const results = await prisma.transaksi.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        tenant: { select: { name: true, code: true } },
        santri: { select: { nama: true, nis: true } },
        tagihan: { select: { nama: true } },
      },
    });

    return results.map(t => ({
      id: t.id,
      tenantId: t.tenantId,
      santriId: t.santriId,
      tagihanId: t.tagihanId,
      amount: t.amount,
      platformFee: t.platformFee,
      gatewayFee: t.gatewayFee,
      netAmount: t.netAmount,
      status: t.status as StatusTransaksi,
      paymentMethod: t.paymentMethod,
      gateway: t.gateway,
      gatewayReference: t.gatewayReference,
      gatewayResponse: t.gatewayResponse as any,
      paidAt: t.paidAt,
      createdAt: t.createdAt,
      orderId: t.orderId,
      tenantName: t.tenant.name,
      tenantCode: t.tenant.code,
      santriName: t.santri.nama,
      santriNis: t.santri.nis,
      tagihanName: t.tagihan?.nama || 'Tagihan Tanpa Nama',
    }));
  }

  async countGlobal(params: { search?: string; status?: string }): Promise<number> {
    const { search, status } = params;
    const whereClause: Prisma.TransaksiWhereInput = {};
    if (status && status !== 'ALL') {
      whereClause.status = status as StatusTransaksi;
    }

    if (search) {
      whereClause.OR = [
        { orderId: { contains: search, mode: 'insensitive' } },
        {
          santri: {
            nama: { contains: search, mode: 'insensitive' },
          },
        },
        {
          tenant: {
            name: { contains: search, mode: 'insensitive' },
          },
        },
      ];
    }

    return prisma.transaksi.count({ where: whereClause });
  }

  async aggregateSuccessVolume(): Promise<{ totalSuccessVolume: bigint; totalSuccessPlatformFees: bigint }> {
    const aggregate = await prisma.transaksi.aggregate({
      _sum: {
        amount: true,
        platformFee: true,
      },
      where: {
        status: 'SUCCESS',
      },
    });

    return {
      totalSuccessVolume: aggregate._sum.amount || 0n,
      totalSuccessPlatformFees: aggregate._sum.platformFee || 0n,
    };
  }

  async findRecentTransactions(take: number): Promise<(Transaksi & { tenantName: string; santriName: string })[]> {
    const results = await prisma.transaksi.findMany({
      orderBy: { createdAt: 'desc' },
      take,
      include: {
        tenant: { select: { name: true } },
        santri: { select: { nama: true } },
      },
    });

    return results.map(t => ({
      id: t.id,
      tenantId: t.tenantId,
      santriId: t.santriId,
      tagihanId: t.tagihanId,
      amount: t.amount,
      platformFee: t.platformFee,
      gatewayFee: t.gatewayFee,
      netAmount: t.netAmount,
      status: t.status as StatusTransaksi,
      paymentMethod: t.paymentMethod,
      gateway: t.gateway,
      gatewayReference: t.gatewayReference,
      gatewayResponse: t.gatewayResponse as any,
      paidAt: t.paidAt,
      createdAt: t.createdAt,
      orderId: t.orderId,
      tenantName: t.tenant.name,
      santriName: t.santri.nama,
    }));
  }
}
