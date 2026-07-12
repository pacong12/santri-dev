import { Tenant } from '../entities/tenant.entity.js';
import { ITenantRepository } from '../repositories/tenant.repository.js';
import { IAuditLogRepository } from '@org/domain-user';

export class UpdateTenantUseCase {
  constructor(
    private tenantRepo: ITenantRepository,
    private auditLogRepo: IAuditLogRepository
  ) {}

  async execute(params: {
    tenantId: string;
    tenantData: {
      name: string;
      code: string;
      phone?: string;
      address?: string;
      emailOfficial?: string;
      defaultDueDays?: number;
      bankName?: string;
      bankAccountNumber?: string;
      bankAccountName?: string;
      gatewayAccountId?: string;
    };
    adminUserId: string;
  }): Promise<Tenant> {
    const tenant = await this.tenantRepo.findById(params.tenantId);
    if (!tenant) {
      throw new Error('Pesantren tidak ditemukan.');
    }

    const { name, code, phone, address, emailOfficial, defaultDueDays, bankName, bankAccountNumber, bankAccountName, gatewayAccountId } = params.tenantData;

    // Check slug pattern regex rules
    if (!/^[a-z0-9-]+$/.test(code)) {
      throw new Error('Kode domain hanya boleh berisi huruf kecil, angka, dan tanda hubung.');
    }

    const conflictingTenant = await this.tenantRepo.findByCode(code);
    if (conflictingTenant && conflictingTenant.id !== params.tenantId) {
      throw new Error('Nama atau kode domain pesantren sudah terdaftar.');
    }

    const changes: string[] = [];
    if (tenant.name !== name) changes.push(`Nama (${tenant.name} -> ${name})`);
    if (tenant.code !== code) changes.push(`Domain (${tenant.code} -> ${code})`);
    if (tenant.phone !== (phone || null)) changes.push(`Telepon`);
    if (tenant.address !== (address || null)) changes.push(`Alamat`);
    if (tenant.emailOfficial !== (emailOfficial || null)) changes.push(`Email`);
    if (tenant.defaultDueDays !== (defaultDueDays || 7)) changes.push(`Due Days`);
    if (tenant.bankName !== (bankName || null)) changes.push(`Bank`);
    if (tenant.bankAccountNumber !== (bankAccountNumber || null)) changes.push(`No Rekening`);
    if (tenant.bankAccountName !== (bankAccountName || null)) changes.push(`Pemilik Rekening`);
    if (tenant.gatewayAccountId !== (gatewayAccountId || null)) changes.push(`Gateway Account`);

    const updatedTenant = await this.tenantRepo.update(params.tenantId, {
      name,
      code,
      phone: phone || null,
      address: address || null,
      emailOfficial: emailOfficial || null,
      defaultDueDays: defaultDueDays || 7,
      bankName: bankName || null,
      bankAccountNumber: bankAccountNumber || null,
      bankAccountName: bankAccountName || null,
      gatewayAccountId: gatewayAccountId || null,
    });

    if (changes.length > 0) {
      await this.auditLogRepo.create({
        tenantId: params.tenantId,
        userId: params.adminUserId,
        action: 'UPDATE_TENANT_DETAILS',
        details: `Mengubah informasi pesantren ${tenant.name}: ${changes.join(', ')}`,
      });
    }

    return updatedTenant;
  }
}
