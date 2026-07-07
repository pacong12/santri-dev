import { IUserRepository, User, Membership, TenantRole, PlatformRole } from '@org/domain-user';
import { prisma } from '../database.js';

export class PrismaUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const result = await prisma.user.findUnique({
      where: { id, deletedAt: null },
    });
    if (!result) return null;
    return {
      ...result,
      platformRole: result.platformRole as PlatformRole | null,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await prisma.user.findUnique({
      where: { email, deletedAt: null },
    });
    if (!result) return null;
    return {
      ...result,
      platformRole: result.platformRole as PlatformRole | null,
    };
  }

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> & { passwordHash: string }): Promise<User> {
    const result = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: data.passwordHash,
        name: data.name,
        platformRole: data.platformRole,
      },
    });
    return {
      ...result,
      platformRole: result.platformRole as PlatformRole | null,
    };
  }

  async update(id: string, data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>): Promise<User> {
    const result = await prisma.user.update({
      where: { id },
      data: {
        username: data.username,
        email: data.email,
        name: data.name,
        platformRole: data.platformRole,
      },
    });
    return {
      ...result,
      platformRole: result.platformRole as PlatformRole | null,
    };
  }

  async delete(id: string): Promise<User> {
    const result = await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return {
      ...result,
      platformRole: result.platformRole as PlatformRole | null,
    };
  }

  async getMemberships(userId: string): Promise<Membership[]> {
    const results = await prisma.membership.findMany({
      where: { userId },
    });
    return results.map(r => ({
      ...r,
      role: r.role as TenantRole,
    }));
  }

  async addMembership(userId: string, tenantId: string, role: TenantRole): Promise<Membership> {
    const result = await prisma.membership.create({
      data: {
        userId,
        tenantId,
        role,
      },
    });
    return {
      ...result,
      role: result.role as TenantRole,
    };
  }

  async removeMembership(userId: string, tenantId: string): Promise<void> {
    await prisma.membership.delete({
      where: {
        userId_tenantId: {
          userId,
          tenantId,
        },
      },
    });
  }
}
