import { ITransaksiRepository, Transaksi, StatusTransaksi } from '@org/domain-transaksi';
import { prisma } from '../database.js';

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
}
