import { Tenant } from '../entities/tenant.entity.js';
import { ITenantRepository } from '../repositories/tenant.repository.js';
import { IAuditLogRepository } from '@org/domain-user';

export class ArchiveTenantUseCase {
  constructor(
    private tenantRepo: ITenantRepository,
    private auditLogRepo: IAuditLogRepository
  ) {}

  async execute(params: {
    tenantId: string;
    adminUserId: string;
  }): Promise<Tenant> {
    const tenant = await this.tenantRepo.findById(params.tenantId);
    if (!tenant) {
      throw new Error('Pesantren tidak ditemukan.');
    }

    const updatedTenant = await this.tenantRepo.delete(params.tenantId);

    // Write AuditLog
    await this.auditLogRepo.create({
      tenantId: params.tenantId,
      userId: params.adminUserId,
      action: 'ARCHIVE_TENANT',
      details: `Mengarsipkan pesantren ${tenant.name} (ID: ${params.tenantId})`,
    });

    return updatedTenant;
  }
}
