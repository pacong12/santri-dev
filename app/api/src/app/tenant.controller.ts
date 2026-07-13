import { Controller, Get, Put, Post, Delete, Body, Headers, Param, UseGuards, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard, TenantGuard, CurrentUser } from './auth.guard.js';
import { PrismaTenantRepository, PrismaUserRepository, PrismaAuditLogRepository, prisma } from '@org/database';
import { UpdateTenantUseCase } from '@org/domain-tenant';
import { ApiResponse } from '@org/shared-types';

@Controller('tenant')
@UseGuards(JwtAuthGuard, TenantGuard)
export class TenantController {
  private readonly tenantRepo = new PrismaTenantRepository();
  private readonly userRepo = new PrismaUserRepository();
  private readonly auditLogRepo = new PrismaAuditLogRepository();
  private readonly updateTenantUseCase = new UpdateTenantUseCase(this.tenantRepo, this.auditLogRepo);

  private async verifyOwner(user: any, tenantId: string) {
    const membership = user.memberships?.find((m: any) => m.tenantId === tenantId);
    if (!membership || membership.role !== 'OWNER') {
      throw new UnauthorizedException('Akses ditolak. Hanya Owner yang dapat melakukan aksi ini.');
    }
  }

  @Get()
  async getTenantDetails(@Headers('x-tenant-id') tenantId: string): Promise<ApiResponse> {
    try {
      const data = await this.tenantRepo.findById(tenantId);
      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to retrieve tenant details',
      });
    }
  }

  @Put()
  async updateTenant(
    @CurrentUser() user: any,
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: any
  ): Promise<ApiResponse> {
    try {
      await this.verifyOwner(user, tenantId);

      const data = await this.updateTenantUseCase.execute({
        tenantId,
        tenantData: {
          name: body.name,
          code: body.code,
          phone: body.phone,
          address: body.address,
          emailOfficial: body.emailOfficial,
          defaultDueDays: body.defaultDueDays ? Number(body.defaultDueDays) : undefined,
          bankName: body.bankName,
          bankAccountNumber: body.bankAccountNumber,
          bankAccountName: body.bankAccountName,
          gatewayAccountId: body.gatewayAccountId,
        },
        adminUserId: user.userId,
      });

      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to update tenant details',
      });
    }
  }

  @Get('staf')
  async getStaf(@Headers('x-tenant-id') tenantId: string): Promise<ApiResponse> {
    try {
      const results = await prisma.membership.findMany({
        where: { tenantId, role: 'ADMIN' },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              name: true,
            },
          },
        },
      });

      const data = results.map(r => ({
        id: r.id,
        userId: r.userId,
        role: r.role,
        createdAt: r.createdAt,
        user: r.user,
      }));

      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to retrieve staff',
      });
    }
  }

  @Post('staf')
  async createStaf(
    @CurrentUser() user: any,
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: { email: string; name: string; username: string }
  ): Promise<ApiResponse> {
    try {
      await this.verifyOwner(user, tenantId);

      if (!body.email || !body.name || !body.username) {
        throw new Error('email, name, and username are required');
      }

      // Check if user already exists
      const existingUser = await this.userRepo.findByEmail(body.email);
      let targetUserId = existingUser?.id;

      if (!existingUser) {
        // Create user with default password 'staf123'
        const newUser = await this.userRepo.create({
          username: body.username,
          email: body.email,
          name: body.name,
          platformRole: null,
          passwordHash: '$2b$10$78KkS2PzWwzP8w.e/f70ae/P7N/27x6q6BuxhJ7BexuW/0aA6h9e.', // 'staf123' hashed
        });
        targetUserId = newUser.id;
      }

      // Check if already member
      const existingMembership = await prisma.membership.findFirst({
        where: { userId: targetUserId, tenantId },
      });

      if (existingMembership) {
        throw new Error('User sudah menjadi bagian dari pesantren ini.');
      }

      const membership = await this.userRepo.addMembership(targetUserId!, tenantId, 'ADMIN');

      // Audit Log
      await this.auditLogRepo.create({
        tenantId,
        userId: user.userId,
        action: 'INVITE_ADMIN',
        details: `Mengundang staf admin baru: ${body.name} (${body.email})`,
      });

      return {
        success: true,
        data: membership,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to add staff admin',
      });
    }
  }

  @Delete('staf/:userId')
  async removeStaf(
    @CurrentUser() user: any,
    @Headers('x-tenant-id') tenantId: string,
    @Param('userId') userId: string
  ): Promise<ApiResponse> {
    try {
      await this.verifyOwner(user, tenantId);

      const targetMember = await prisma.membership.findFirst({
        where: { userId, tenantId, role: 'ADMIN' },
        include: { user: true },
      });

      if (!targetMember) {
        throw new Error('Staf admin tidak ditemukan.');
      }

      await this.userRepo.removeMembership(userId, tenantId);

      // Audit Log
      await this.auditLogRepo.create({
        tenantId,
        userId: user.userId,
        action: 'REMOVE_ADMIN',
        details: `Mencabut akses staf admin: ${targetMember.user.name} (${targetMember.user.email})`,
      });

      return {
        success: true,
        data: targetMember,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to remove staff admin',
      });
    }
  }

  @Get('audit-logs')
  async getAuditLogs(@Headers('x-tenant-id') tenantId: string): Promise<ApiResponse> {
    try {
      const data = await this.auditLogRepo.findAllByTenant(tenantId);
      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to retrieve audit logs',
      });
    }
  }
}
