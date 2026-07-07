import { Tagihan, KelasPayment, StatusTagihan } from '../entities/tagihan.entity.js';

export class BillingService {
  /**
   * Generates a draft Tagihan for a student based on a KelasPayment cost template.
   * Returns data ready to be passed to ITagihanRepository.create().
   */
  generateTagihan(params: {
    tenantId: string;
    santriId: string;
    kelasPayment: KelasPayment;
    periode: string; // e.g. "2026-07"
    dueDate: Date;
    tahunAjaranId: string | null;
  }): Omit<Tagihan, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
    return {
      santriId: params.santriId,
      jenisTagihanId: params.kelasPayment.jenisTagihanId,
      tahunAjaranId: params.tahunAjaranId,
      nama: `Tagihan - ${params.periode}`,
      amount: params.kelasPayment.amount,
      periode: params.periode,
      status: StatusTagihan.PENDING,
      dueDate: params.dueDate,
    };
  }
}
