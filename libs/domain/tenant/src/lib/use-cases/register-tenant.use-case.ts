import { Tenant, TenantStatus } from '../entities/tenant.entity.js';
import { ITenantRepository } from '../repositories/tenant.repository.js';
import { IUserRepository, TenantRole } from '@org/domain-user';

export class RegisterTenantUseCase {
  constructor(
    private tenantRepo: ITenantRepository,
    private userRepo: IUserRepository
  ) {}

  /**
   * Executing the tenant registration interactor workflow.
   */
  async execute(params: {
    tenantData: {
      name: string;
      code: string;
      phone: string;
      address: string;
      emailOfficial: string;
      bankName: string;
      bankAccountNumber: string;
      bankAccountName: string;
      gatewayAccountId: string | null;
      logoUrl: string | null;
      defaultDueDays: number;
    };
    ownerData: {
      username: string;
      email: string;
      passwordHash: string;
      name: string;
    };
  }): Promise<{ tenant: Tenant; owner: any }> {
    // 1. Verify tenant code uniqueness
    const existingTenant = await this.tenantRepo.findByCode(params.tenantData.code);
    if (existingTenant) {
      throw new Error(`Tenant code "${params.tenantData.code}" is already taken`);
    }

    // 2. Verify user email uniqueness
    const existingUser = await this.userRepo.findByEmail(params.ownerData.email);
    if (existingUser) {
      throw new Error(`User with email "${params.ownerData.email}" is already registered`);
    }

    // 3. Create Tenant
    const tenant = await this.tenantRepo.create({
      name: params.tenantData.name,
      code: params.tenantData.code,
      status: TenantStatus.ACTIVE,
      phone: params.tenantData.phone,
      address: params.tenantData.address,
      emailOfficial: params.tenantData.emailOfficial,
      bankName: params.tenantData.bankName,
      bankAccountNumber: params.tenantData.bankAccountNumber,
      bankAccountName: params.tenantData.bankAccountName,
      gatewayAccountId: params.tenantData.gatewayAccountId,
      logoUrl: params.tenantData.logoUrl,
      defaultDueDays: params.tenantData.defaultDueDays,
    });

    // 4. Create Owner User
    const owner = await this.userRepo.create({
      username: params.ownerData.username,
      email: params.ownerData.email,
      passwordHash: params.ownerData.passwordHash,
      name: params.ownerData.name,
      platformRole: null, // Default standard user
    });

    // 5. Add OWNER membership
    await this.userRepo.addMembership(owner.id, tenant.id, TenantRole.OWNER);

    return { tenant, owner };
  }
}
