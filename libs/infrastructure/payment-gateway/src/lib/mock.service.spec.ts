import { describe, it, expect } from 'vitest';
import { MockPaymentGatewayService } from './mock.service.js';
import { CreateCheckoutParams } from '@org/domain-transaksi';

describe('MockPaymentGatewayService', () => {
  const service = new MockPaymentGatewayService();

  it('should successfully create mock checkout session', async () => {
    const params: CreateCheckoutParams = {
      orderId: 'TX-1234',
      amount: BigInt(505000),
      platformFee: BigInt(1000),
      gatewayFee: BigInt(4000),
      netAmount: BigInt(500000),
      tenantGatewayAccountId: 'sub-merchant-123',
      santriDetails: { nama: 'Test Student' },
      tagihanDetails: { nama: 'School SPP' },
    };

    const result = await service.createCheckoutSession(params);
    expect(result.token).toContain('mock-snap-token-TX-1234');
    expect(result.redirectUrl).toContain(result.token);
  });

  it('should correctly map success webhook payload', async () => {
    const payload = {
      order_id: 'TX-1234',
      transaction_status: 'settlement',
      payment_type: 'bank_transfer',
      transaction_id: 'midtrans-ref-xyz',
    };

    const result = await service.verifyWebhook(payload);
    expect(result.orderId).toBe('TX-1234');
    expect(result.status).toBe('SUCCESS');
    expect(result.paymentMethod).toBe('bank_transfer');
    expect(result.gatewayReference).toBe('midtrans-ref-xyz');
    expect(result.paidAt).toBeInstanceOf(Date);
  });

  it('should correctly map pending webhook payload', async () => {
    const payload = {
      order_id: 'TX-1234',
      transaction_status: 'pending',
      payment_type: 'bank_transfer',
      transaction_id: 'midtrans-ref-xyz',
    };

    const result = await service.verifyWebhook(payload);
    expect(result.orderId).toBe('TX-1234');
    expect(result.status).toBe('PENDING');
    expect(result.paidAt).toBeNull();
  });
});
