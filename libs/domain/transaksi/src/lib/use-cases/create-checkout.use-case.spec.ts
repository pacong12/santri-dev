import { describe, it, expect, vi } from 'vitest';
import { CreateCheckoutUseCase } from './create-checkout.use-case.js';
import { ITransaksiRepository } from '../repositories/transaksi.repository.js';
import { IPaymentGatewayService } from '../services/payment-gateway.service.js';
import { Transaksi, StatusTransaksi } from '../entities/transaksi.entity.js';

describe('CreateCheckoutUseCase', () => {
  const mockParams = {
    tenantId: 'tenant-123',
    santriId: 'santri-456',
    tagihanId: 'tagihan-789',
    orderId: 'TX-12345678',
    amount: BigInt(505000),
    platformFee: BigInt(1000),
    gatewayFee: BigInt(4000),
    netAmount: BigInt(500000),
    tenantGatewayAccountId: 'midtrans-sub-123',
    santriDetails: { nama: 'Ahmad Fauzi', email: 'ahmad@example.com', phone: '081234567' },
    tagihanDetails: { nama: 'SPP Juli 2026' },
  };

  const mockTransaksi: Transaksi = {
    id: 'transaksi-uuid',
    tenantId: 'tenant-123',
    santriId: 'santri-456',
    tagihanId: 'tagihan-789',
    orderId: 'TX-12345678',
    amount: BigInt(505000),
    platformFee: BigInt(1000),
    gatewayFee: BigInt(4000),
    netAmount: BigInt(500000),
    status: StatusTransaksi.PENDING,
    paymentMethod: null,
    gateway: 'midtrans',
    gatewayReference: null,
    gatewayResponse: null,
    paidAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should successfully create checkout session and log pending transaction', async () => {
    const mockPaymentGateway = {
      createCheckoutSession: vi.fn().mockResolvedValue({
        token: 'snap-token-123',
        redirectUrl: 'https://midtrans-snap.com/token-123',
      }),
    } as unknown as IPaymentGatewayService;

    const mockTransaksiRepo = {
      create: vi.fn().mockResolvedValue(mockTransaksi),
    } as unknown as ITransaksiRepository;

    const useCase = new CreateCheckoutUseCase(mockTransaksiRepo, mockPaymentGateway);

    const result = await useCase.execute(mockParams);

    expect(result.token).toBe('snap-token-123');
    expect(result.redirectUrl).toBe('https://midtrans-snap.com/token-123');
    expect(result.transaksi).toEqual(mockTransaksi);

    expect(mockPaymentGateway.createCheckoutSession).toHaveBeenCalledWith({
      orderId: mockParams.orderId,
      amount: mockParams.amount,
      platformFee: mockParams.platformFee,
      gatewayFee: mockParams.gatewayFee,
      netAmount: mockParams.netAmount,
      tenantGatewayAccountId: mockParams.tenantGatewayAccountId,
      santriDetails: mockParams.santriDetails,
      tagihanDetails: mockParams.tagihanDetails,
    });

    expect(mockTransaksiRepo.create).toHaveBeenCalledWith('tenant-123', {
      santriId: 'santri-456',
      tagihanId: 'tagihan-789',
      orderId: 'TX-12345678',
      amount: BigInt(505000),
      platformFee: BigInt(1000),
      gatewayFee: BigInt(4000),
      netAmount: BigInt(500000),
      status: StatusTransaksi.PENDING,
      paymentMethod: null,
      gateway: 'midtrans',
      gatewayReference: null,
      gatewayResponse: null,
      paidAt: null,
    });
  });
});
