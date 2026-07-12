import { Tenant, TenantStatus } from '../entities/tenant.entity.js';
import { ITenantRepository } from '../repositories/tenant.repository.js';
import { IAuditLogRepository } from '@org/domain-user';

export class CreateTenantUseCase {
  constructor(
    private tenantRepo: ITenantRepository,
    private auditLogRepo: IAuditLogRepository
  ) {}

  async execute(params: {
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
    const { name, code, phone, address, emailOfficial, defaultDueDays, bankName, bankAccountNumber, bankAccountName, gatewayAccountId } = params.tenantData;

    // Check slug pattern regex rules
    if (!/^[a-z0-9-]+$/.test(code)) {
      throw new Error('Kode domain hanya boleh berisi huruf kecil, angka, dan tanda hubung.');
    }

    const existingTenant = await this.tenantRepo.findByCode(code);
    if (existingTenant) {
      throw new Error('Nama atau kode domain pesantren sudah terdaftar.');
    }

    const tenant = await this.tenantRepo.create({
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
      status: TenantStatus.ACTIVE,
      logoUrl: null,
    });

    // Write AuditLog
    await this.auditLogRepo.create({
      tenantId: tenant.id,
      userId: params.adminUserId,
      action: 'CREATE_TENANT',
      details: `Mendaftarkan pesantren baru: ${name} (Domain: ${code})`,
    });

    return tenant;
  }
}
