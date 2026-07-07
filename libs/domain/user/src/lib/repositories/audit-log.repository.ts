import { AuditLog } from '../entities/audit-log.entity.js';

export interface IAuditLogRepository {
  create(data: Omit<AuditLog, 'id' | 'createdAt'>): Promise<AuditLog>;
  findAllByTenant(tenantId: string): Promise<AuditLog[]>;
}
