import { Santri } from '../entities/santri.entity.js';
import { ISantriRepository } from '../repositories/santri.repository.js';

export class DeleteSantriUseCase {
  constructor(private santriRepo: ISantriRepository) {}

  /**
   * Executing soft delete of student profile.
   */
  async execute(params: { tenantId: string; id: string }): Promise<Santri> {
    const existing = await this.santriRepo.findById(params.tenantId, params.id);
    if (!existing) {
      throw new Error(`Santri with ID "${params.id}" not found`);
    }

    return this.santriRepo.delete(params.tenantId, params.id);
  }
}
