import { Controller, Get, Post, Patch, Put, Delete, Body, Param, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard, SuperadminGuard, CurrentUser } from './auth.guard.js';
import { TenantStatus } from '@org/domain-tenant';
import { ApiResponse } from '@org/shared-types';
import { SuperadminService } from './superadmin.service.js';

@Controller('superadmin')
@UseGuards(JwtAuthGuard, SuperadminGuard)
export class SuperadminController {
  constructor(private readonly superadminService: SuperadminService) {}

  @Get('tenants')
  async getTenants(): Promise<ApiResponse> {
    try {
      const data = await this.superadminService.getTenants();
      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to retrieve tenants',
      });
    }
  }

  @Post('tenants')
  async createTenant(
    @CurrentUser() user: { userId: string },
    @Body() body: {
      name: string;
      code: string;
      defaultDueDays?: number;
      phone?: string;
      address?: string;
      emailOfficial?: string;
      bankName?: string;
      bankAccountNumber?: string;
      bankAccountName?: string;
      gatewayAccountId?: string;
    }
  ): Promise<ApiResponse> {
    try {
      const data = await this.superadminService.createTenant(body, user.userId);
      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to create tenant',
      });
    }
  }

  @Patch('tenants/:id/status')
  async updateTenantStatus(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() body: { status: string }
  ): Promise<ApiResponse> {
    try {
      const data = await this.superadminService.updateTenantStatus(id, body.status as TenantStatus, user.userId);
      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to update tenant status',
      });
    }
  }

  @Put('tenants/:id')
  async updateTenant(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() body: {
      name: string;
      code: string;
      defaultDueDays?: number;
      phone?: string;
      address?: string;
      emailOfficial?: string;
      bankName?: string;
      bankAccountNumber?: string;
      bankAccountName?: string;
      gatewayAccountId?: string;
    }
  ): Promise<ApiResponse> {
    try {
      const data = await this.superadminService.updateTenant(id, body, user.userId);
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

  @Get('tenants/:id')
  async getTenantDetails(@Param('id') id: string): Promise<ApiResponse> {
    try {
      const data = await this.superadminService.getTenantDetails(id);
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

  @Delete('tenants/:id')
  async deleteTenant(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string
  ): Promise<ApiResponse> {
    try {
      const data = await this.superadminService.deleteTenant(id, user.userId);
      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to archive tenant',
      });
    }
  }

  @Get('dashboard-stats')
  async getDashboardStats(): Promise<ApiResponse> {
    try {
      const data = await this.superadminService.getDashboardStats();
      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to retrieve dashboard stats',
      });
    }
  }

  @Get('settings')
  async getSettings(): Promise<ApiResponse> {
    try {
      const data = await this.superadminService.getSettings();
      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to retrieve platform settings',
      });
    }
  }

  @Put('settings')
  async updateSettings(
    @CurrentUser() user: { userId: string },
    @Body() body: { transactionFee: number }
  ): Promise<ApiResponse> {
    try {
      const data = await this.superadminService.updateSettings(body.transactionFee, user.userId);
      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to update settings',
      });
    }
  }

  @Get('audit-logs')
  async getAuditLogs(
    @Query('page') pageRaw?: string,
    @Query('limit') limitRaw?: string,
    @Query('search') search?: string,
    @Query('action') action?: string,
  ): Promise<ApiResponse> {
    try {
      const data = await this.superadminService.getAuditLogs(pageRaw, limitRaw, search, action);
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

  @Get('transactions')
  async getTransactions(
    @Query('page') pageRaw?: string,
    @Query('limit') limitRaw?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ): Promise<ApiResponse> {
    try {
      const data = await this.superadminService.getTransactions(pageRaw, limitRaw, search, status);
      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to retrieve transactions',
      });
    }
  }
}
