import { IAuditLogRepository, AuditLog } from '@org/domain-user';
import { prisma } from '../database.js';

export class PrismaAuditLogRepository implements IAuditLogRepository {
  async create(data: Omit<AuditLog, 'id' | 'createdAt'>): Promise<AuditLog> {
    return prisma.auditLog.create({
      data: {
        tenantId: data.tenantId,
        userId: data.userId,
        action: data.action,
        details: data.details,
      },
    });
  }

  async findAllByTenant(tenantId: string): Promise<AuditLog[]> {
    return prisma.auditLog.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
