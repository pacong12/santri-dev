import { IPlatformSettingRepository } from '../repositories/platform-setting.repository.js';
import { PlatformSetting } from '../entities/platform-setting.entity.js';
import { IAuditLogRepository } from '@org/domain-user';
import { ITenantRepository } from '@org/domain-tenant';

export class UpdateSettingsUseCase {
  constructor(
    private settingRepo: IPlatformSettingRepository,
    private auditLogRepo: IAuditLogRepository,
    private tenantRepo: ITenantRepository
  ) {}

  async execute(params: {
    transactionFee: number;
    adminUserId: string;
  }): Promise<PlatformSetting> {
    const { transactionFee, adminUserId } = params;

    if (transactionFee === undefined || transactionFee < 0) {
      throw new Error('Biaya transaksi platform harus berupa angka positif.');
    }

    let setting = await this.settingRepo.findFirst();
    if (setting) {
      setting = await this.settingRepo.update(setting.id, BigInt(transactionFee));
    } else {
      setting = await this.settingRepo.create(BigInt(transactionFee));
    }

    // Write AuditLog under the first active tenant to satisfy foreign key requirement
    const activeTenants = await this.tenantRepo.findManyActive();
    const firstTenant = activeTenants[0];

    if (firstTenant) {
      await this.auditLogRepo.create({
        tenantId: firstTenant.id,
        userId: adminUserId,
        action: 'UPDATE_PLATFORM_FEE',
        details: `Mengubah biaya transaksi platform menjadi Rp ${transactionFee.toLocaleString('id-ID')}`,
      });
    }

    return setting;
  }
}
