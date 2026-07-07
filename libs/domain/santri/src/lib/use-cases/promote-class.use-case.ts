import { Santri } from '../entities/santri.entity.js';
import { ISantriRepository } from '../repositories/santri.repository.js';

export class PromoteClassUseCase {
  constructor(private santriRepo: ISantriRepository) {}

  /**
   * Executing the promote class use case.
   */
  async execute(params: {
    tenantId: string;
    santriId: string;
    newKelasId: string;
  }): Promise<Santri> {
    const santri = await this.santriRepo.findById(params.tenantId, params.santriId);
    if (!santri) {
      throw new Error(`Santri with ID ${params.santriId} not found`);
    }

    const targetClass = await this.santriRepo.findClassById(params.tenantId, params.newKelasId);
    if (!targetClass) {
      throw new Error(`Class with ID ${params.newKelasId} not found`);
    }

    const oldKelasId = santri.kelasId;
    
    // Update student's class
    const updatedSantri = await this.santriRepo.update(params.tenantId, params.santriId, {
      kelasId: params.newKelasId,
    });

    // Log the mutation history
    await this.santriRepo.addHistory({
      tenantId: params.tenantId,
      santriId: params.santriId,
      kelasLamaId: oldKelasId,
      kelasBaruId: params.newKelasId,
    });

    return updatedSantri;
  }
}
