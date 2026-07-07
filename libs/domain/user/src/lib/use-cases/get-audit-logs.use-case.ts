import { AuditLog } from '../entities/audit-log.entity.js';
import { IAuditLogRepository } from '../repositories/audit-log.repository.js';

export class GetAuditLogsUseCase {
  constructor(private auditLogRepo: IAuditLogRepository) {}

  /**
   * Executing the retrieve audit logs usecase.
   */
  async execute(params: { tenantId: string }): Promise<AuditLog[]> {
    return this.auditLogRepo.findAllByTenant(params.tenantId);
  }
}
