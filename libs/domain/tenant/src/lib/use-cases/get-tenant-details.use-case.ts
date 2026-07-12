import { ITenantRepository } from '../repositories/tenant.repository.js';
import { ITransaksiRepository } from '@org/domain-transaksi';
import { IAuditLogRepository } from '@org/domain-user';
import { bigintToNumber } from '@org/shared-utils';

export class GetTenantDetailsUseCase {
  constructor(
    private tenantRepo: ITenantRepository,
    private transaksiRepo: ITransaksiRepository,
    private auditLogRepo: IAuditLogRepository
  ) {}

  async execute(params: { tenantId: string }) {
    const tenant = await this.tenantRepo.findById(params.tenantId);

    if (!tenant) {
      throw new Error('Pesantren tidak ditemukan.');
    }

    const { santriCount, kelasCount, tagihanCount } = await this.tenantRepo.getTenantMetrics(params.tenantId);

    const transactions = await this.transaksiRepo.findAllByTenant(params.tenantId);
    const successTransactions = transactions.filter(t => t.status === 'SUCCESS');

    const totalVolume = successTransactions.reduce((acc, curr) => acc + bigintToNumber(curr.amount), 0);
    const totalPlatformFees = successTransactions.reduce((acc, curr) => acc + bigintToNumber(curr.platformFee), 0);

    const auditLogs = await this.auditLogRepo.findAllByTenant(params.tenantId);
    const slicedLogs = auditLogs.slice(0, 30);

    const formattedLogs = slicedLogs.map(log => ({
      id: log.id,
      action: log.action,
      details: log.details,
      createdAt: log.createdAt,
      actorName: log.actorName || 'System',
    }));

    return {
      tenant,
      stats: {
        santriCount,
        kelasCount,
        tagihanCount,
        totalVolume,
        totalPlatformFees,
      },
      auditLogs: formattedLogs,
    };
  }
}
