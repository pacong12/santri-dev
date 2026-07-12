import { ITransaksiRepository } from '../repositories/transaksi.repository.js';
import { bigintToNumber } from '@org/shared-utils';

export class GetGlobalTransactionsUseCase {
  constructor(private transaksiRepo: ITransaksiRepository) {}

  async execute(params: {
    pageRaw?: string;
    limitRaw?: string;
    search?: string;
    status?: string;
  }) {
    const { pageRaw, limitRaw, search, status } = params;
    const page = Math.max(1, parseInt(pageRaw || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(limitRaw || '20', 10)));

    const rawTransactions = await this.transaksiRepo.findManyGlobalPaginated({
      page,
      limit,
      search,
      status,
    });

    const total = await this.transaksiRepo.countGlobal({
      search,
      status,
    });

    const formattedTransactions = rawTransactions.map(t => ({
      id: t.id,
      tenantName: t.tenantName,
      tenantCode: t.tenantCode,
      santriName: t.santriName,
      santriNis: t.santriNis,
      tagihanName: t.tagihanName,
      amount: bigintToNumber(t.amount),
      platformFee: bigintToNumber(t.platformFee),
      gatewayFee: bigintToNumber(t.gatewayFee),
      netAmount: bigintToNumber(t.netAmount),
      orderId: t.orderId,
      status: t.status,
      paymentMethod: t.paymentMethod,
      gateway: t.gateway,
      gatewayReference: t.gatewayReference,
      gatewayResponse: t.gatewayResponse,
      paidAt: t.paidAt,
      createdAt: t.createdAt,
    }));

    const aggregates = await this.transaksiRepo.aggregateSuccessVolume();

    return {
      transactions: formattedTransactions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalSuccessVolume: bigintToNumber(aggregates.totalSuccessVolume),
      totalSuccessPlatformFees: bigintToNumber(aggregates.totalSuccessPlatformFees),
    };
  }
}
