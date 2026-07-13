import { Controller, Get, Post, Body, Headers, Param, UseGuards, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard, TenantGuard, CurrentUser } from './auth.guard.js';
import { PrismaTagihanRepository, PrismaSantriRepository, PrismaAuditLogRepository } from '@org/database';
import { DbNotificationService } from '@org/notification';
import { CancelBillingUseCase, GenerateBulkBillingUseCase, GetActiveBillingUseCase } from '@org/domain-tagihan';
import { ApiResponse } from '@org/shared-types';

@Controller('tagihan')
@UseGuards(JwtAuthGuard, TenantGuard)
export class TagihanController {
  private readonly tagihanRepo = new PrismaTagihanRepository();
  private readonly santriRepo = new PrismaSantriRepository();
  private readonly auditLogRepo = new PrismaAuditLogRepository();
  private readonly notificationService = new DbNotificationService();

  private readonly getActiveBillingUseCase = new GetActiveBillingUseCase(this.tagihanRepo);
  private readonly generateBulkBillingUseCase = new GenerateBulkBillingUseCase(this.tagihanRepo, this.notificationService);
  private readonly cancelBillingUseCase = new CancelBillingUseCase(this.tagihanRepo, this.auditLogRepo);

  @Get()
  async getTagihan(@Headers('x-tenant-id') tenantId: string): Promise<ApiResponse> {
    try {
      const data = await this.tagihanRepo.findAllByTenant(tenantId);
      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to retrieve bills',
      });
    }
  }

  @Get('active/:santriId')
  async getActiveBilling(
    @Headers('x-tenant-id') tenantId: string,
    @Param('santriId') santriId: string
  ): Promise<ApiResponse> {
    try {
      const data = await this.getActiveBillingUseCase.execute({ tenantId, santriId });
      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to retrieve active billing',
      });
    }
  }

  @Post('bulk')
  async generateBulkBilling(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: { kelasId: string; periode: string; dueDate: string; tahunAjaranId: string | null }
  ): Promise<ApiResponse> {
    try {
      if (!body.kelasId || !body.periode || !body.dueDate) {
        throw new Error('kelasId, periode, and dueDate are required');
      }

      // Query students in this class
      const students = await this.santriRepo.findAllByTenant(tenantId);
      const classStudents = students.filter(s => s.kelasId === body.kelasId);

      const data = await this.generateBulkBillingUseCase.execute({
        tenantId,
        kelasId: body.kelasId,
        students: classStudents.map(s => ({ id: s.id, userId: s.userId })),
        periode: body.periode,
        dueDate: new Date(body.dueDate),
        tahunAjaranId: body.tahunAjaranId,
      });

      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to generate bulk billing',
      });
    }
  }

  @Post(':id/cancel')
  async cancelBilling(
    @CurrentUser() user: { userId: string },
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() body: { reason: string }
  ): Promise<ApiResponse> {
    try {
      if (!body.reason) {
        throw new Error('reason is required');
      }
      const data = await this.cancelBillingUseCase.execute({
        tenantId,
        id,
        adminUserId: user.userId,
        reason: body.reason,
      });
      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to cancel bill',
      });
    }
  }

  @Get('pricing')
  async getPricing(@Headers('x-tenant-id') tenantId: string): Promise<ApiResponse> {
    try {
      const data = await this.tagihanRepo.findAllPricing(tenantId);
      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to retrieve pricing templates',
      });
    }
  }

  @Post('pricing')
  async createPricing(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: { kelasId: string; jenisTagihanId: string; amount: number; periode: string }
  ): Promise<ApiResponse> {
    try {
      if (!body.kelasId || !body.jenisTagihanId || !body.amount || !body.periode) {
        throw new Error('kelasId, jenisTagihanId, amount, and periode are required');
      }
      const data = await this.tagihanRepo.createPricing(tenantId, {
        kelasId: body.kelasId,
        jenisTagihanId: body.jenisTagihanId,
        amount: BigInt(body.amount),
        periode: body.periode,
      });
      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to create pricing template',
      });
    }
  }

  @Get('jenis')
  async getJenisTagihan(@Headers('x-tenant-id') tenantId: string): Promise<ApiResponse> {
    try {
      const data = await this.tagihanRepo.findJenisTagihanByTenant(tenantId);
      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to retrieve billing types',
      });
    }
  }

  @Post('jenis')
  async createJenisTagihan(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: { nama: string }
  ): Promise<ApiResponse> {
    try {
      if (!body.nama) {
        throw new Error('nama is required');
      }
      const data = await this.tagihanRepo.createJenisTagihan(tenantId, body.nama);
      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to create billing type',
      });
    }
  }

  // NOTE: GET :id must be declared LAST to avoid capturing literal routes like 'pricing', 'jenis', 'active'
  @Get(':id')
  async getTagihanById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string
  ): Promise<ApiResponse> {
    try {
      const tagihan = await this.tagihanRepo.findById(tenantId, id);
      if (!tagihan) {
        throw new Error('Tagihan tidak ditemukan');
      }

      // Ambil data santri terkait
      const santri = await this.santriRepo.findById(tenantId, tagihan.santriId);

      // Ambil jenis tagihan
      const jenisTagihan = tagihan.jenisTagihanId
        ? await this.tagihanRepo.findJenisTagihanById(tenantId, tagihan.jenisTagihanId)
        : null;

      return {
        success: true,
        data: {
          ...tagihan,
          amount: Number(tagihan.amount),
          santri,
          jenisTagihan,
        },
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to retrieve bill details',
      });
    }
  }
}
