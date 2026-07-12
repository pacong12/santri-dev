import { AuditLog } from '../entities/audit-log.entity.js';

export interface IAuditLogRepository {
  create(data: Omit<AuditLog, 'id' | 'createdAt'>): Promise<AuditLog>;
  findAllByTenant(tenantId: string): Promise<(AuditLog & { actorName?: string })[]>;
  findManyGlobalPaginated(params: {
    page: number;
    limit: number;
    search?: string;
    action?: string;
  }): Promise<(AuditLog & { actorName: string; tenantName: string; tenantCode: string })[]>;
  countGlobal(params: {
    search?: string;
    action?: string;
  }): Promise<number>;
  getUniqueActions(): Promise<string[]>;
}
