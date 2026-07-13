import { describe, it, expect, vi } from 'vitest';
import { UpdateSettingsUseCase } from './update-settings.use-case.js';
import { IPlatformSettingRepository } from '../repositories/platform-setting.repository.js';
import { IAuditLogRepository } from '@org/domain-user';
import { ITenantRepository, Tenant, TenantStatus } from '@org/domain-tenant';
import { PlatformSetting } from '../entities/platform-setting.entity.js';

describe('UpdateSettingsUseCase', () => {
  const mockPlatformSetting: PlatformSetting = {
    id: 'setting-123',
    transactionFee: BigInt(1000),
    updatedAt: new Date(),
  };

  const mockTenant: Tenant = {
    id: 'tenant-123',
    name: 'Pesantren Gontor',
    code: 'gontor',
    status: TenantStatus.ACTIVE,
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

  it('should create new settings if none exist, write audit log', async () => {
    const mockSettingRepo = {
      findFirst: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ ...mockPlatformSetting, transactionFee: BigInt(2000) }),
    } as unknown as IPlatformSettingRepository;

    const mockAuditLogRepo = {
      create: vi.fn().mockResolvedValue({}),
    } as unknown as IAuditLogRepository;

    const mockTenantRepo = {
      findManyActive: vi.fn().mockResolvedValue([mockTenant]),
    } as unknown as ITenantRepository;

    const useCase = new UpdateSettingsUseCase(mockSettingRepo, mockAuditLogRepo, mockTenantRepo);

    const result = await useCase.execute({
      transactionFee: 2000,
      adminUserId: 'admin-1',
    });

    expect(result.transactionFee).toBe(BigInt(2000));
    expect(mockSettingRepo.findFirst).toHaveBeenCalled();
    expect(mockSettingRepo.create).toHaveBeenCalledWith(BigInt(2000));
    expect(mockTenantRepo.findManyActive).toHaveBeenCalled();
    expect(mockAuditLogRepo.create).toHaveBeenCalledWith({
      tenantId: 'tenant-123',
      userId: 'admin-1',
      action: 'UPDATE_PLATFORM_FEE',
      details: expect.stringContaining('2.000'),
    });
  });

  it('should update existing settings if they exist, write audit log', async () => {
    const mockSettingRepo = {
      findFirst: vi.fn().mockResolvedValue(mockPlatformSetting),
      update: vi.fn().mockResolvedValue({ ...mockPlatformSetting, transactionFee: BigInt(3000) }),
    } as unknown as IPlatformSettingRepository;

    const mockAuditLogRepo = {
      create: vi.fn().mockResolvedValue({}),
    } as unknown as IAuditLogRepository;

    const mockTenantRepo = {
      findManyActive: vi.fn().mockResolvedValue([mockTenant]),
    } as unknown as ITenantRepository;

    const useCase = new UpdateSettingsUseCase(mockSettingRepo, mockAuditLogRepo, mockTenantRepo);

    const result = await useCase.execute({
      transactionFee: 3000,
      adminUserId: 'admin-1',
    });

    expect(result.transactionFee).toBe(BigInt(3000));
    expect(mockSettingRepo.findFirst).toHaveBeenCalled();
    expect(mockSettingRepo.update).toHaveBeenCalledWith('setting-123', BigInt(3000));
    expect(mockAuditLogRepo.create).toHaveBeenCalled();
  });

  it('should throw an error if the transactionFee is negative', async () => {
    const mockSettingRepo = {} as unknown as IPlatformSettingRepository;
    const mockAuditLogRepo = {} as unknown as IAuditLogRepository;
    const mockTenantRepo = {} as unknown as ITenantRepository;

    const useCase = new UpdateSettingsUseCase(mockSettingRepo, mockAuditLogRepo, mockTenantRepo);

    await expect(
      useCase.execute({
        transactionFee: -100,
        adminUserId: 'admin-1',
      })
    ).rejects.toThrow('Biaya transaksi platform harus berupa angka positif.');
  });
});
