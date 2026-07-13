import { Controller, Get, Post, Delete, Body, Headers, Param, UseGuards, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard, TenantGuard } from './auth.guard.js';
import { PrismaSantriRepository } from '@org/database';
import { CreateSantriUseCase, PromoteClassUseCase, DeleteSantriUseCase } from '@org/domain-santri';
import { CreateSantriSchema } from '@org/shared-validation';
import { ApiResponse } from '@org/shared-types';

@Controller('santri')
@UseGuards(JwtAuthGuard, TenantGuard)
export class SantriController {
  private readonly santriRepo = new PrismaSantriRepository();
  private readonly createSantriUseCase = new CreateSantriUseCase(this.santriRepo);
  private readonly promoteClassUseCase = new PromoteClassUseCase(this.santriRepo);
  private readonly deleteSantriUseCase = new DeleteSantriUseCase(this.santriRepo);

  @Get()
  async getSantri(@Headers('x-tenant-id') tenantId: string): Promise<ApiResponse> {
    try {
      const data = await this.santriRepo.findAllByTenant(tenantId);
      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to retrieve students',
      });
    }
  }

  @Get(':id')
  async getSantriById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string
  ): Promise<ApiResponse> {
    try {
      const santri = await this.santriRepo.findById(tenantId, id);
      if (!santri) {
        throw new Error('Santri tidak ditemukan');
      }

      // Ambil kelas santri
      const kelas = await this.santriRepo.findClassById(tenantId, santri.kelasId);

      // Ambil riwayat mutasi kelas
      const riwayat = await this.santriRepo.findHistoryBySantri(tenantId, id);

      return {
        success: true,
        data: {
          ...santri,
          kelas,
          riwayatKelas: riwayat,
        },
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to retrieve student details',
      });
    }
  }

  @Post()
  async createSantri(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: any
  ): Promise<ApiResponse> {
    try {
      const validated = CreateSantriSchema.parse(body);
      const data = await this.createSantriUseCase.execute({
        tenantId,
        kelasId: validated.kelasId,
        userId: null, // Wali parent starts empty, linked separately
        nis: validated.nis,
        nama: validated.nama,
        namaBapak: validated.namaBapak,
        namaIbu: validated.namaIbu,
        alamat: validated.alamat,
      });
      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to create student',
      });
    }
  }

  @Post(':id/promote')
  async promoteClass(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() body: { newKelasId: string }
  ): Promise<ApiResponse> {
    try {
      if (!body.newKelasId) {
        throw new Error('newKelasId is required');
      }
      const data = await this.promoteClassUseCase.execute({
        tenantId,
        santriId: id,
        newKelasId: body.newKelasId,
      });
      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to promote class',
      });
    }
  }

  @Delete(':id')
  async deleteSantri(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string
  ): Promise<ApiResponse> {
    try {
      const data = await this.deleteSantriUseCase.execute({
        tenantId,
        id,
      });
      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to delete student',
      });
    }
  }
}
