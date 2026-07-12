import { IPlatformSettingRepository } from '../repositories/platform-setting.repository.js';
import { PlatformSetting } from '../entities/platform-setting.entity.js';

export class GetSettingsUseCase {
  constructor(private settingRepo: IPlatformSettingRepository) {}

  async execute(): Promise<PlatformSetting> {
    let setting = await this.settingRepo.findFirst();
    if (!setting) {
      setting = await this.settingRepo.create(5000n);
    }
    return setting;
  }
}
