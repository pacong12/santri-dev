import { IAuditLogRepository } from '../repositories/audit-log.repository.js';

export class GetGlobalAuditLogsUseCase {
  constructor(private auditLogRepo: IAuditLogRepository) {}

  async execute(params: {
    pageRaw?: string;
    limitRaw?: string;
    search?: string;
    action?: string;
  }) {
    const { pageRaw, limitRaw, search, action } = params;
    const page = Math.max(1, parseInt(pageRaw || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(limitRaw || '20', 10)));

    const logs = await this.auditLogRepo.findManyGlobalPaginated({
      page,
      limit,
      search,
      action,
    });

    const total = await this.auditLogRepo.countGlobal({
      search,
      action,
    });

    const uniqueActions = await this.auditLogRepo.getUniqueActions();

    return {
      logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      uniqueActions,
    };
  }
}
