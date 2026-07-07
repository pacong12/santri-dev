import { Controller, Post, Body, Headers, HttpCode, HttpStatus, Logger, HttpException } from '@nestjs/common';
import { ProcessWebhookUseCase } from '@org/domain-transaksi';
import { PrismaTransaksiRepository, PrismaTagihanRepository } from '@org/database';
import { MidtransPaymentGatewayService } from '@org/payment-gateway';
import { DbNotificationService } from '@org/notification';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);
  private processWebhookUseCase: ProcessWebhookUseCase;

  constructor() {
    const serverKey = process.env['MIDTRANS_SERVER_KEY'] || '';
    const clientKey = process.env['MIDTRANS_CLIENT_KEY'] || '';
    const isProduction = process.env['MIDTRANS_IS_PRODUCTION'] === 'true';

    const gateway = new MidtransPaymentGatewayService({
      serverKey,
      clientKey,
      isProduction,
    });

    const transaksiRepo = new PrismaTransaksiRepository();
    const tagihanRepo = new PrismaTagihanRepository();
    const notificationRepo = new DbNotificationService();

    this.processWebhookUseCase = new ProcessWebhookUseCase(transaksiRepo, tagihanRepo, gateway, notificationRepo);
  }

  @Post('midtrans')
  @HttpCode(HttpStatus.OK)
  async handleMidtransWebhook(
    @Body() payload: any,
    @Headers() headers: Record<string, string>
  ) {
    const orderId = payload.order_id || payload.orderId;
    this.logger.log(`Received webhook from Midtrans. Order ID: ${orderId}`);
    
    try {
      const result = await this.processWebhookUseCase.execute({ payload, headers });
      this.logger.log(`Successfully processed webhook. Order ID: ${result.orderId}, Status: ${result.status}`);
      return { status: 'success', orderId: result.orderId };
    } catch (error: any) {
      this.logger.error(`Error processing Midtrans webhook: ${error.message}`);
      throw new HttpException(
        { status: 'error', message: error.message },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
