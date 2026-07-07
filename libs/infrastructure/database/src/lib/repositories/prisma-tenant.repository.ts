import { ITenantRepository, Tenant, TenantStatus } from '@org/domain-tenant';
import { prisma } from '../database.js';

export class PrismaTenantRepository implements ITenantRepository {
  async findById(id: string): Promise<Tenant | null> {
    const result = await prisma.tenant.findUnique({
      where: { id, deletedAt: null },
    });
    if (!result) return null;
    return {
      ...result,
      status: result.status as TenantStatus,
    };
  }

  async findByCode(code: string): Promise<Tenant | null> {
    const result = await prisma.tenant.findUnique({
      where: { code, deletedAt: null },
    });
    if (!result) return null;
    return {
      ...result,
      status: result.status as TenantStatus,
    };
  }

  async create(data: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Tenant> {
    const result = await prisma.tenant.create({
      data: {
        name: data.name,
        code: data.code,
        status: data.status,
        phone: data.phone,
        address: data.address,
        gatewayAccountId: data.gatewayAccountId,
        bankName: data.bankName,
        bankAccountNumber: data.bankAccountNumber,
        bankAccountName: data.bankAccountName,
        logoUrl: data.logoUrl,
        emailOfficial: data.emailOfficial,
        defaultDueDays: data.defaultDueDays,
      },
    });
    return {
      ...result,
      status: result.status as TenantStatus,
    };
  }

  async update(id: string, data: Partial<Omit<Tenant, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>): Promise<Tenant> {
    const result = await prisma.tenant.update({
      where: { id },
      data: {
        name: data.name,
        code: data.code,
        status: data.status,
        phone: data.phone,
        address: data.address,
        gatewayAccountId: data.gatewayAccountId,
        bankName: data.bankName,
        bankAccountNumber: data.bankAccountNumber,
        bankAccountName: data.bankAccountName,
        logoUrl: data.logoUrl,
        emailOfficial: data.emailOfficial,
        defaultDueDays: data.defaultDueDays,
      },
    });
    return {
      ...result,
      status: result.status as TenantStatus,
    };
  }

  async delete(id: string): Promise<Tenant> {
    const result = await prisma.tenant.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return {
      ...result,
      status: result.status as TenantStatus,
    };
  }
}
