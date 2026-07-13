import { vi, describe, it, expect } from 'vitest';
import { PrismaPlatformSettingRepository } from './prisma-platform-setting.repository.js';
import { prisma } from '../database.js';

vi.mock('../database.js', () => ({
  prisma: {
    platformSetting: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe('PrismaPlatformSettingRepository', () => {
  const repository = new PrismaPlatformSettingRepository();

  it('should call prisma.platformSetting.findFirst', async () => {
    const mockSetting = { id: 'setting-1', transactionFee: BigInt(1000) };
    vi.mocked(prisma.platformSetting.findFirst).mockResolvedValue(mockSetting);

    const result = await repository.findFirst();

    expect(result).toEqual(mockSetting);
    expect(prisma.platformSetting.findFirst).toHaveBeenCalled();
  });

  it('should call prisma.platformSetting.create with transactionFee', async () => {
    const mockSetting = { id: 'setting-1', transactionFee: BigInt(2000) };
    vi.mocked(prisma.platformSetting.create).mockResolvedValue(mockSetting);

    const result = await repository.create(BigInt(2000));

    expect(result).toEqual(mockSetting);
    expect(prisma.platformSetting.create).toHaveBeenCalledWith({
      data: { transactionFee: BigInt(2000) },
    });
  });

  it('should call prisma.platformSetting.update with id and transactionFee', async () => {
    const mockSetting = { id: 'setting-1', transactionFee: BigInt(3000) };
    vi.mocked(prisma.platformSetting.update).mockResolvedValue(mockSetting);

    const result = await repository.update('setting-1', BigInt(3000));

    expect(result).toEqual(mockSetting);
    expect(prisma.platformSetting.update).toHaveBeenCalledWith({
      where: { id: 'setting-1' },
      data: { transactionFee: BigInt(3000) },
    });
  });
});
