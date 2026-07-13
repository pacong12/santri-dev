import { describe, it, expect, vi } from 'vitest';
import { UpdateTenantStatusUseCase } from './update-tenant-status.use-case.js';
import { TenantStatus } from '../entities/tenant.entity.js';
import { ITenantRepository } from '../repositories/tenant.repository.js';
import { IAuditLogRepository } from '@org/domain-user';

describe('UpdateTenantStatusUseCase', () => {
  it('should successfully update tenant status and write audit log', async () => {
    const mockTenant = {
      id: 'tenant-1',
      name: 'Pesantren Gontor',
      code: 'gontor',
      status: TenantStatus.INACTIVE,
      phone: null,
      address: null,
      gatewayAccountId: null,
      bankName: null,
      bankAccountNumber: null,
      bankAccountName: null,
      logoUrl: null,
      emailOfficial: null,
      defaultDueDays: 7,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const mockTenantRepo = {
      findById: vi.fn().mockResolvedValue(mockTenant),
      update: vi.fn().mockImplementation((id, data) => Promise.resolve({ ...mockTenant, ...data })),
    } as unknown as ITenantRepository;

    const mockAuditLogRepo = {
      create: vi.fn().mockResolvedValue({}),
    } as unknown as IAuditLogRepository;

    const useCase = new UpdateTenantStatusUseCase(mockTenantRepo, mockAuditLogRepo);
    const result = await useCase.execute({
      tenantId: 'tenant-1',
      status: TenantStatus.ACTIVE,
      adminUserId: 'user-admin',
    });

    expect(result.status).toBe(TenantStatus.ACTIVE);
    expect(mockTenantRepo.findById).toHaveBeenCalledWith('tenant-1');
    expect(mockTenantRepo.update).toHaveBeenCalledWith('tenant-1', { status: TenantStatus.ACTIVE });
    expect(mockAuditLogRepo.create).toHaveBeenCalledWith({
      tenantId: 'tenant-1',
      userId: 'user-admin',
      action: 'UPDATE_TENANT_STATUS',
      details: expect.stringContaining('ACTIVE'),
    });
  });

  it('should throw error when tenant is not found', async () => {
    const mockTenantRepo = {
      findById: vi.fn().mockResolvedValue(null),
    } as unknown as ITenantRepository;

    const mockAuditLogRepo = {} as unknown as IAuditLogRepository;

    const useCase = new UpdateTenantStatusUseCase(mockTenantRepo, mockAuditLogRepo);
    await expect(
      useCase.execute({
        tenantId: 'non-existent',
        status: TenantStatus.ACTIVE,
        adminUserId: 'user-admin',
      })
    ).rejects.toThrow('Pesantren tidak ditemukan.');
  });
});
