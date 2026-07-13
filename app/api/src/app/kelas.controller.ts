import { Controller, Get, Post, Delete, Body, Headers, Param, UseGuards, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard, TenantGuard } from './auth.guard.js';
import { PrismaSantriRepository } from '@org/database';
import { CreateKelasSchema, CreateTahunAjaranSchema } from '@org/shared-validation';
import { ApiResponse } from '@org/shared-types';

@Controller('kelas')
@UseGuards(JwtAuthGuard, TenantGuard)
export class KelasController {
  private readonly santriRepo = new PrismaSantriRepository();

  @Get()
  async getClasses(@Headers('x-tenant-id') tenantId: string): Promise<ApiResponse> {
    try {
      const data = await this.santriRepo.findClassesByTenant(tenantId);
      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to retrieve classes',
      });
    }
  }

  @Get(':id')
  async getClassById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string
  ): Promise<ApiResponse> {
    try {
      const data = await this.santriRepo.findClassWithStudents(tenantId, id);
      if (!data) {
        throw new Error('Kelas tidak ditemukan');
      }
      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to retrieve class details',
      });
    }
  }

  @Post()
  async createClass(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: any
  ): Promise<ApiResponse> {
    try {
      const validated = CreateKelasSchema.parse(body);
      const data = await this.santriRepo.createClass(tenantId, validated);
      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to create class',
      });
    }
  }

  @Delete(':id')
  async deleteClass(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string
  ): Promise<ApiResponse> {
    try {
      const data = await this.santriRepo.deleteClass(tenantId, id);
      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to delete class',
      });
    }
  }

  @Get('tahun-ajaran')
  async getAcademicYears(@Headers('x-tenant-id') tenantId: string): Promise<ApiResponse> {
    try {
      const data = await this.santriRepo.findTahunAjaranByTenant(tenantId);
      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to retrieve academic years',
      });
    }
  }

  @Post('tahun-ajaran')
  async createAcademicYear(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: any
  ): Promise<ApiResponse> {
    try {
      const validated = CreateTahunAjaranSchema.parse(body);
      const data = await this.santriRepo.createTahunAjaran(tenantId, validated.name, validated.aktif);
      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to create academic year',
      });
    }
  }
}
