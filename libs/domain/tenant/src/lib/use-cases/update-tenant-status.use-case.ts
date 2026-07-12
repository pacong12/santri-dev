import { Tenant, TenantStatus } from '../entities/tenant.entity.js';
import { ITenantRepository } from '../repositories/tenant.repository.js';
import { IAuditLogRepository } from '@org/domain-user';

export class UpdateTenantStatusUseCase {
  constructor(
    private tenantRepo: ITenantRepository,
    private auditLogRepo: IAuditLogRepository
  ) {}

  async execute(params: {
    tenantId: string;
    status: TenantStatus;
    adminUserId: string;
  }): Promise<Tenant> {
    const tenant = await this.tenantRepo.findById(params.tenantId);
    if (!tenant) {
      throw new Error('Pesantren tidak ditemukan.');
    }

    const updatedTenant = await this.tenantRepo.update(params.tenantId, { status: params.status });

    // Write AuditLog
    await this.auditLogRepo.create({
      tenantId: params.tenantId,
      userId: params.adminUserId,
      action: 'UPDATE_TENANT_STATUS',
      details: `Mengubah status keaktifan pesantren ${tenant.name} menjadi ${params.status}`,
    });

    return updatedTenant;
  }
}
