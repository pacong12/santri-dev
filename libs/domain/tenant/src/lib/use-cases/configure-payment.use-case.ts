import { Tenant } from '../entities/tenant.entity.js';
import { ITenantRepository } from '../repositories/tenant.repository.js';
import { IAuditLogRepository } from '@org/domain-user';

export class ConfigurePaymentUseCase {
  constructor(
    private tenantRepo: ITenantRepository,
    private auditLogRepo: IAuditLogRepository
  ) {}

  /**
   * Executing the configure payment details usecase.
   */
  async execute(params: {
    tenantId: string;
    adminUserId: string;
    paymentConfig: {
      bankName: string;
      bankAccountNumber: string;
      bankAccountName: string;
      gatewayAccountId: string | null;
    };
  }): Promise<Tenant> {
    // 1. Check if tenant exists
    const tenant = await this.tenantRepo.findById(params.tenantId);
    if (!tenant) {
      throw new Error(`Tenant with ID ${params.tenantId} not found`);
    }

    // 2. Update payment fields
    const updatedTenant = await this.tenantRepo.update(params.tenantId, {
      bankName: params.paymentConfig.bankName,
      bankAccountNumber: params.paymentConfig.bankAccountNumber,
      bankAccountName: params.paymentConfig.bankAccountName,
      gatewayAccountId: params.paymentConfig.gatewayAccountId,
    });

    // 3. Write log to AuditLog
    await this.auditLogRepo.create({
      tenantId: params.tenantId,
      userId: params.adminUserId,
      action: 'PAYMENT_CONFIG_UPDATED',
      details: `Updated bank settings: Bank ${params.paymentConfig.bankName}, Acc: ${params.paymentConfig.bankAccountNumber}. Gateway Sub ID: ${params.paymentConfig.gatewayAccountId || 'None'}`,
    });

    return updatedTenant;
  }
}
