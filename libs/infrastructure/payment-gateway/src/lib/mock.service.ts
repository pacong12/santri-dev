import { IPaymentGatewayService, CreateCheckoutParams, CheckoutSessionResult, WebhookVerificationResult } from '@org/domain-transaksi';

export class MockPaymentGatewayService implements IPaymentGatewayService {
  async createCheckoutSession(params: CreateCheckoutParams): Promise<CheckoutSessionResult> {
    const token = `mock-snap-token-${params.orderId}-${Date.now()}`;
    const redirectUrl = `https://app.sandbox.midtrans.com/snap/v2/vtweb/${token}`;
    
    return { token, redirectUrl };
  }

  async verifyWebhook(payload: any, headers?: Record<string, string>): Promise<WebhookVerificationResult> {
    const orderId = payload.order_id || payload.orderId;
    const status = 
      payload.transaction_status === 'settlement' || payload.transaction_status === 'capture' || payload.status === 'SUCCESS'
        ? 'SUCCESS'
        : payload.transaction_status === 'pending' || payload.status === 'PENDING'
        ? 'PENDING'
        : 'FAILED';

    const paymentMethod = payload.payment_type || payload.paymentMethod || 'mock_pay';
    const gatewayReference = payload.transaction_id || payload.gatewayReference || `mock-ref-${Date.now()}`;
    
    return {
      orderId,
      status,
      paymentMethod,
      gatewayReference,
      rawResponse: payload,
      paidAt: status === 'SUCCESS' ? new Date() : null,
    };
  }
}
