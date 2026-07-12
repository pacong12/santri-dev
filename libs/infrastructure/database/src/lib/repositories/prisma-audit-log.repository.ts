import { IAuditLogRepository, AuditLog } from '@org/domain-user';
import { prisma, Prisma } from '../database.js';

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

  async findAllByTenant(tenantId: string): Promise<(AuditLog & { actorName?: string })[]> {
    const results = await prisma.auditLog.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, username: true } },
      },
    });
    return results.map(r => ({
      id: r.id,
      tenantId: r.tenantId,
      userId: r.userId,
      action: r.action,
      details: r.details,
      createdAt: r.createdAt,
      actorName: r.user?.name || r.user?.username || 'System',
    }));
  }

  async findManyGlobalPaginated(params: {
    page: number;
    limit: number;
    search?: string;
    action?: string;
  }): Promise<(AuditLog & { actorName: string; tenantName: string; tenantCode: string })[]> {
    const { page, limit, search, action } = params;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.AuditLogWhereInput = {};
    if (action && action !== 'ALL') {
      whereClause.action = action;
    }

    if (search) {
      whereClause.OR = [
        { details: { contains: search, mode: 'insensitive' } },
        { action: { contains: search, mode: 'insensitive' } },
        {
          user: {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { username: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
        {
          tenant: {
            name: { contains: search, mode: 'insensitive' },
          },
        },
      ];
    }

    const results = await prisma.auditLog.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        user: { select: { name: true, username: true } },
        tenant: { select: { name: true, code: true } },
      },
    });

    return results.map(l => ({
      id: l.id,
      tenantId: l.tenantId,
      userId: l.userId,
      action: l.action,
      details: l.details,
      createdAt: l.createdAt,
      actorName: l.user.name || l.user.username,
      tenantName: l.tenant.name,
      tenantCode: l.tenant.code,
    }));
  }

  async countGlobal(params: { search?: string; action?: string }): Promise<number> {
    const { search, action } = params;
    const whereClause: Prisma.AuditLogWhereInput = {};
    if (action && action !== 'ALL') {
      whereClause.action = action;
    }

    if (search) {
      whereClause.OR = [
        { details: { contains: search, mode: 'insensitive' } },
        { action: { contains: search, mode: 'insensitive' } },
        {
          user: {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { username: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
        {
          tenant: {
            name: { contains: search, mode: 'insensitive' },
          },
        },
      ];
    }

    return prisma.auditLog.count({ where: whereClause });
  }

  async getUniqueActions(): Promise<string[]> {
    const raw = await prisma.auditLog.groupBy({
      by: ['action'],
    });
    return raw.map(r => r.action);
  }
}
