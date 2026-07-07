import { Tagihan, StatusTagihan } from '../entities/tagihan.entity.js';
import { ITagihanRepository } from '../repositories/tagihan.repository.js';
import { INotificationRepository } from '../repositories/notification.repository.js';

export class GenerateBulkBillingUseCase {
  constructor(
    private tagihanRepo: ITagihanRepository,
    private notificationRepo?: INotificationRepository
  ) {}

  /**
   * Executing the bulk billing generator use case.
   */
  async execute(params: {
    tenantId: string;
    kelasId: string;
    students: Array<{ id: string; userId?: string | null }>;
    periode: string; // e.g. "2026-07"
    dueDate: Date;
    tahunAjaranId: string | null;
  }): Promise<Tagihan[]> {
    const templates = await this.tagihanRepo.findPricingByClass(params.tenantId, params.kelasId);
    if (templates.length === 0) {
      throw new Error(`No pricing templates found for class ID ${params.kelasId}`);
    }

    const createdBills: Tagihan[] = [];

    for (const student of params.students) {
      for (const template of templates) {
        const draft: Omit<Tagihan, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'deletedAt'> = {
          santriId: student.id,
          jenisTagihanId: template.jenisTagihanId,
          tahunAjaranId: params.tahunAjaranId,
          nama: `Tagihan - ${template.periode} - ${params.periode}`,
          amount: template.amount,
          periode: params.periode,
          status: StatusTagihan.PENDING,
          dueDate: params.dueDate,
        };

        const bill = await this.tagihanRepo.create(params.tenantId, draft);
        createdBills.push(bill);

        // Send notification to Wali if user ID exists
        if (student.userId && this.notificationRepo) {
          await this.notificationRepo.sendNotification({
            tenantId: params.tenantId,
            userId: student.userId,
            title: 'Tagihan Baru Diterbitkan',
            message: `Tagihan baru sebesar Rp ${template.amount.toLocaleString('id-ID')} telah diterbitkan untuk periode ${params.periode}.`,
            type: 'NEW_BILLING',
            tagihanId: bill.id,
          });
        }
      }
    }

    return createdBills;
  }
}
