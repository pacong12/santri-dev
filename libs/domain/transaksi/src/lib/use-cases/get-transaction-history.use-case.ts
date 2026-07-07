import { Transaksi } from '../entities/transaksi.entity.js';
import { ITransaksiRepository } from '../repositories/transaksi.repository.js';

export class GetTransactionHistoryUseCase {
  constructor(private transaksiRepo: ITransaksiRepository) {}

  /**
   * Executing retrieve transaction history list usecase.
   */
  async execute(params: { tenantId: string }): Promise<Transaksi[]> {
    return this.transaksiRepo.findAllByTenant(params.tenantId);
  }
}
