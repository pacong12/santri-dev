import { PlatformSetting } from '../entities/platform-setting.entity.js';

export interface IPlatformSettingRepository {
  findFirst(): Promise<PlatformSetting | null>;
  create(transactionFee: bigint): Promise<PlatformSetting>;
  update(id: string, transactionFee: bigint): Promise<PlatformSetting>;
}
