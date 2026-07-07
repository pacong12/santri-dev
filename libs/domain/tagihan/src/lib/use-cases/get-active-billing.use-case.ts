import { Tagihan, StatusTagihan } from '../entities/tagihan.entity.js';
import { ITagihanRepository } from '../repositories/tagihan.repository.js';

export class GetActiveBillingUseCase {
  constructor(private tagihanRepo: ITagihanRepository) {}

  /**
   * Executing the retrieve active pending billing list usecase.
   */
  async execute(params: { tenantId: string; santriId: string }): Promise<Tagihan[]> {
    const allBills = await this.tagihanRepo.findAllBySantri(params.tenantId, params.santriId);
    return allBills.filter(b => b.status === StatusTagihan.PENDING);
  }
}
