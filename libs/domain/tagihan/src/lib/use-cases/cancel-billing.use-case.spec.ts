import { describe, it, expect, vi } from 'vitest';
import { CancelBillingUseCase } from './cancel-billing.use-case.js';
import { ITagihanRepository } from '../repositories/tagihan.repository.js';
import { Tagihan, StatusTagihan } from '../entities/tagihan.entity.js';
import { IAuditLogRepository } from '@org/domain-user';

describe('CancelBillingUseCase', () => {
  const mockTagihan: Tagihan = {
    id: 'tagihan-123',
    tenantId: 'tenant-abc',
    santriId: 'santri-xyz',
    jenisTagihanId: 'jenis-spp',
    tahunAjaranId: 'ta-2026',
    nama: 'Syahriah SPP Juli 2026',
    amount: BigInt(500000),
    periode: '2026-07',
    status: StatusTagihan.PENDING,
    dueDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  it('should successfully cancel a pending tagihan and write audit log', async () => {
    const mockTagihanRepo = {
      findById: vi.fn().mockResolvedValue(mockTagihan),
      update: vi.fn().mockImplementation((tenantId, id, data) => Promise.resolve({ ...mockTagihan, ...data })),
    } as unknown as ITagihanRepository;

    const mockAuditLogRepo = {
      create: vi.fn().mockResolvedValue({}),
    } as unknown as IAuditLogRepository;

    const useCase = new CancelBillingUseCase(mockTagihanRepo, mockAuditLogRepo);

    const result = await useCase.execute({
      tenantId: 'tenant-abc',
      id: 'tagihan-123',
      adminUserId: 'user-admin',
      reason: 'Wrong amount entered',
    });

    expect(result.status).toBe(StatusTagihan.CANCELLED);
    expect(mockTagihanRepo.findById).toHaveBeenCalledWith('tenant-abc', 'tagihan-123');
    expect(mockTagihanRepo.update).toHaveBeenCalledWith('tenant-abc', 'tagihan-123', {
      status: StatusTagihan.CANCELLED,
    });
    expect(mockAuditLogRepo.create).toHaveBeenCalledWith({
      tenantId: 'tenant-abc',
      userId: 'user-admin',
      action: 'BILLING_CANCELLED',
      details: expect.stringContaining('Wrong amount entered'),
    });
  });

  it('should throw an error if the tagihan is not found', async () => {
    const mockTagihanRepo = {
      findById: vi.fn().mockResolvedValue(null),
    } as unknown as ITagihanRepository;

    const mockAuditLogRepo = {} as unknown as IAuditLogRepository;

    const useCase = new CancelBillingUseCase(mockTagihanRepo, mockAuditLogRepo);

    await expect(
      useCase.execute({
        tenantId: 'tenant-abc',
        id: 'tagihan-nonexistent',
        adminUserId: 'user-admin',
        reason: 'Wrong amount entered',
      })
    ).rejects.toThrow('Tagihan with ID tagihan-nonexistent not found');
  });

  it('should throw an error if trying to cancel a non-pending tagihan', async () => {
    const paidTagihan = { ...mockTagihan, status: StatusTagihan.PAID };
    const mockTagihanRepo = {
      findById: vi.fn().mockResolvedValue(paidTagihan),
    } as unknown as ITagihanRepository;

    const mockAuditLogRepo = {} as unknown as IAuditLogRepository;

    const useCase = new CancelBillingUseCase(mockTagihanRepo, mockAuditLogRepo);

    await expect(
      useCase.execute({
        tenantId: 'tenant-abc',
        id: 'tagihan-123',
        adminUserId: 'user-admin',
        reason: 'Wrong amount entered',
      })
    ).rejects.toThrow('Only PENDING tagihan can be cancelled. Current status: PAID');
  });
});
