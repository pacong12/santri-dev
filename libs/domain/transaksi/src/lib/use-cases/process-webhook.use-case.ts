import { Transaksi, StatusTransaksi } from '../entities/transaksi.entity.js';
import { ITransaksiRepository } from '../repositories/transaksi.repository.js';
import { IPaymentGatewayService } from '../services/payment-gateway.service.js';
import { INotificationRepository } from '../repositories/notification.repository.js';
import { ITagihanRepository } from '@org/domain-tagihan';
import { getTenantIdFromOrderId } from '@org/shared-utils';

export class ProcessWebhookUseCase {
  constructor(
    private transaksiRepo: ITransaksiRepository,
    private tagihanRepo: ITagihanRepository,
    private paymentGateway: IPaymentGatewayService,
    private notificationRepo?: INotificationRepository
  ) {}

  /**
   * Executing the webhook verification and database update process.
   */
  async execute(params: {
    payload: any;
    headers?: Record<string, string>;
  }): Promise<Transaksi> {
    const { payload, headers } = params;

    // 1. Parse and extract tenantId from orderId
    const orderId = payload.order_id || payload.orderId;
    if (!orderId) {
      throw new Error('Order ID is missing in webhook payload');
    }
    const tenantId = getTenantIdFromOrderId(orderId);

    // 2. Verify callback signature authenticity
    const verification = await this.paymentGateway.verifyWebhook(payload, headers);

    // 3. Load transaction by order ID
    const transaksi = await this.transaksiRepo.findByOrderId(tenantId, orderId);
    if (!transaksi) {
      throw new Error(`Transaction with Order ID ${orderId} not found in Tenant ${tenantId}`);
    }

    // 4. Update transaction status
    const updatedStatus = verification.status as StatusTransaksi;
    const updatedTransaksi = await this.transaksiRepo.update(tenantId, transaksi.id, {
      status: updatedStatus,
      paymentMethod: verification.paymentMethod,
      gatewayReference: verification.gatewayReference,
      gatewayResponse: verification.rawResponse,
      paidAt: verification.paidAt,
    });

    // 5. If transaction succeeded, mark the associated Tagihan invoice as lunas (PAID)
    if (updatedStatus === StatusTransaksi.SUCCESS && transaksi.tagihanId) {
      await this.tagihanRepo.update(tenantId, transaksi.tagihanId, {
        status: 'PAID' as any,
      });

      // Send successful payment notification
      if (this.notificationRepo) {
        await this.notificationRepo.sendNotification({
          tenantId: tenantId,
          userId: transaksi.santriId, // associated to parent/student
          title: 'Pembayaran Sukses',
          message: `Pembayaran untuk Tagihan sebesar Rp ${transaksi.amount.toLocaleString('id-ID')} telah sukses dikonfirmasi. Terima kasih.`,
          type: 'PAYMENT_SUCCESS',
          tagihanId: transaksi.tagihanId,
        });
      }
    }

    return updatedTransaksi;
  }
}
