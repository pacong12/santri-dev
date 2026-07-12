import { IPlatformSettingRepository, PlatformSetting } from '@org/domain-platform';
import { prisma } from '../database.js';

export class PrismaPlatformSettingRepository implements IPlatformSettingRepository {
  async findFirst(): Promise<PlatformSetting | null> {
    return prisma.platformSetting.findFirst();
  }

  async create(transactionFee: bigint): Promise<PlatformSetting> {
    return prisma.platformSetting.create({
      data: { transactionFee },
    });
  }

  async update(id: string, transactionFee: bigint): Promise<PlatformSetting> {
    return prisma.platformSetting.update({
      where: { id },
      data: { transactionFee },
    });
  }
}
