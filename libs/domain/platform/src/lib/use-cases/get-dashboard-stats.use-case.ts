import { ITenantRepository } from '@org/domain-tenant';
import { ITransaksiRepository } from '@org/domain-transaksi';
import { bigintToNumber } from '@org/shared-utils';

export class GetDashboardStatsUseCase {
  constructor(
    private tenantRepo: ITenantRepository,
    private transaksiRepo: ITransaksiRepository
  ) {}

  async execute() {
    const totalTenants = await this.tenantRepo.countAll();
    const activeTenants = await this.tenantRepo.countActive();
    const transactionsCount = await this.transaksiRepo.countGlobal({ status: 'SUCCESS' });

    const aggregates = await this.transaksiRepo.aggregateSuccessVolume();
    const totalVolume = bigintToNumber(aggregates.totalSuccessVolume);
    const totalPlatformFees = bigintToNumber(aggregates.totalSuccessPlatformFees);

    const recentTenants = await this.tenantRepo.findRecentTenants(5);
    const rawRecentTransactions = await this.transaksiRepo.findRecentTransactions(5);

    const recentTransactions = rawRecentTransactions.map(t => ({
      id: t.id,
      tenantName: t.tenantName,
      santriName: t.santriName,
      amount: bigintToNumber(t.amount),
      status: t.status,
      createdAt: t.createdAt,
    }));

    return {
      totalTenants,
      activeTenants,
      transactionsCount,
      totalVolume,
      totalPlatformFees,
      recentTenants,
      recentTransactions,
    };
  }
}
