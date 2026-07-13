import { Controller, Get, Post, Body, Headers, Param, UseGuards, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard, TenantGuard } from './auth.guard.js';
import { PrismaTransaksiRepository, PrismaSantriRepository, PrismaTagihanRepository } from '@org/database';
import { MidtransPaymentGatewayService, MockPaymentGatewayService } from '@org/payment-gateway';
import { CreateCheckoutUseCase, GetTransactionHistoryUseCase } from '@org/domain-transaksi';
import { CreateTransaksiSchema } from '@org/shared-validation';
import { ApiResponse } from '@org/shared-types';

@Controller('payments')
@UseGuards(JwtAuthGuard, TenantGuard)
export class TransaksiController {
  private readonly transaksiRepo = new PrismaTransaksiRepository();
  private readonly santriRepo = new PrismaSantriRepository();
  private readonly tagihanRepo = new PrismaTagihanRepository();

  private readonly gatewayService = process.env['MIDTRANS_SERVER_KEY'] && process.env['MIDTRANS_CLIENT_KEY']
    ? new MidtransPaymentGatewayService({
        serverKey: process.env['MIDTRANS_SERVER_KEY'],
        clientKey: process.env['MIDTRANS_CLIENT_KEY'] || '',
        isProduction: process.env['NODE_ENV'] === 'production',
      })
    : new MockPaymentGatewayService();

  private readonly createCheckoutUseCase = new CreateCheckoutUseCase(this.transaksiRepo, this.gatewayService);
  private readonly getTransactionHistoryUseCase = new GetTransactionHistoryUseCase(this.transaksiRepo);

  @Get()
  async getTenantTransactions(@Headers('x-tenant-id') tenantId: string): Promise<ApiResponse> {
    try {
      const data = await this.transaksiRepo.findAllByTenant(tenantId);
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

  @Get('history/:santriId')
  async getSantriHistory(
    @Headers('x-tenant-id') tenantId: string,
    @Param('santriId') santriId: string
  ): Promise<ApiResponse> {
    try {
      const data = await this.getTransactionHistoryUseCase.execute({ tenantId, santriId });
      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to retrieve transaction history',
      });
    }
  }

  @Post('checkout')
  async createCheckout(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: any
  ): Promise<ApiResponse> {
    try {
      const validated = CreateTransaksiSchema.parse(body);

      // Fetch student details
      const student = await this.santriRepo.findById(tenantId, validated.santriId);
      if (!student) {
        throw new Error('Santri not found');
      }

      // Fetch tagihan details if tagihanId is provided
      let tagihanDetails = { nama: 'Pembayaran Deposit/Iuran' };
      if (validated.tagihanId) {
        const tagihan = await this.tagihanRepo.findById(tenantId, validated.tagihanId);
        if (tagihan) {
          tagihanDetails = { nama: tagihan.nama };
        }
      }

      const data = await this.createCheckoutUseCase.execute({
        tenantId,
        santriId: validated.santriId,
        tagihanId: validated.tagihanId || null,
        orderId: validated.orderId,
        amount: validated.amount,
        platformFee: validated.platformFee,
        gatewayFee: validated.gatewayFee,
        netAmount: validated.netAmount,
        tenantGatewayAccountId: null, // Filled automatically or retrieved from tenant config
        santriDetails: {
          nama: student.nama,
          email: `${student.nis}@pesantren.com`,
        },
        tagihanDetails,
      });

      // Convert BigInt inside result.transaksi to number for serialization
      const serializedTransaksi = {
        ...data.transaksi,
        amount: Number(data.transaksi.amount),
        platformFee: Number(data.transaksi.platformFee),
        gatewayFee: Number(data.transaksi.gatewayFee),
        netAmount: Number(data.transaksi.netAmount),
      };

      return {
        success: true,
        data: {
          token: data.token,
          redirectUrl: data.redirectUrl,
          transaksi: serializedTransaksi,
        },
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Failed to create checkout session',
      });
    }
  }
}
