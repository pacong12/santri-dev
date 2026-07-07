import { Tagihan, StatusTagihan } from '../entities/tagihan.entity.js';
import { ITagihanRepository } from '../repositories/tagihan.repository.js';
import { IAuditLogRepository } from '@org/domain-user';

export class CancelBillingUseCase {
  constructor(
    private tagihanRepo: ITagihanRepository,
    private auditLogRepo: IAuditLogRepository
  ) {}

  /**
   * Executing the cancel billing use case.
   */
  async execute(params: {
    tenantId: string;
    id: string;
    adminUserId: string;
    reason: string;
  }): Promise<Tagihan> {
    const tagihan = await this.tagihanRepo.findById(params.tenantId, params.id);
    if (!tagihan) {
      throw new Error(`Tagihan with ID ${params.id} not found`);
    }

    if (tagihan.status !== StatusTagihan.PENDING) {
      throw new Error(`Only PENDING tagihan can be cancelled. Current status: ${tagihan.status}`);
    }

    // Update status to CANCELLED
    const updatedTagihan = await this.tagihanRepo.update(params.tenantId, params.id, {
      status: StatusTagihan.CANCELLED,
    });

    // Record to AuditLog
    await this.auditLogRepo.create({
      tenantId: params.tenantId,
      userId: params.adminUserId,
      action: 'BILLING_CANCELLED',
      details: `Cancelled Tagihan ID: ${params.id} for Santri ID: ${tagihan.santriId}. Reason: ${params.reason}`,
    });

    return updatedTagihan;
  }
}
