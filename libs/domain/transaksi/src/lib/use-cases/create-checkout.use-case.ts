import { Transaksi, StatusTransaksi } from '../entities/transaksi.entity.js';
import { ITransaksiRepository } from '../repositories/transaksi.repository.js';
import { IPaymentGatewayService } from '../services/payment-gateway.service.js';

export class CreateCheckoutUseCase {
  constructor(
    private transaksiRepo: ITransaksiRepository,
    private paymentGateway: IPaymentGatewayService
  ) {}

  /**
   * Executing the checkout session creation use case.
   */
  async execute(params: {
    tenantId: string;
    santriId: string;
    tagihanId: string | null;
    orderId: string;
    amount: bigint;
    platformFee: bigint;
    gatewayFee: bigint;
    netAmount: bigint;
    tenantGatewayAccountId: string | null;
    santriDetails: { nama: string; email?: string; phone?: string };
    tagihanDetails: { nama: string; description?: string };
  }): Promise<{ token: string; redirectUrl: string; transaksi: Transaksi }> {
    // 1. Create Checkout Session via payment gateway
    const checkoutResult = await this.paymentGateway.createCheckoutSession({
      orderId: params.orderId,
      amount: params.amount,
      platformFee: params.platformFee,
      gatewayFee: params.gatewayFee,
      netAmount: params.netAmount,
      tenantGatewayAccountId: params.tenantGatewayAccountId,
      santriDetails: params.santriDetails,
      tagihanDetails: params.tagihanDetails,
    });

    // 2. Log transaction in pending state
    const transaksi = await this.transaksiRepo.create(params.tenantId, {
      santriId: params.santriId,
      tagihanId: params.tagihanId,
      orderId: params.orderId,
      amount: params.amount,
      platformFee: params.platformFee,
      gatewayFee: params.gatewayFee,
      netAmount: params.netAmount,
      status: StatusTransaksi.PENDING,
      paymentMethod: null,
      gateway: 'midtrans',
      gatewayReference: null,
      gatewayResponse: null,
      paidAt: null,
    });

    return {
      token: checkoutResult.token,
      redirectUrl: checkoutResult.redirectUrl,
      transaksi,
    };
  }
}
