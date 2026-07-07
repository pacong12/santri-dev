import { Santri } from '../entities/santri.entity.js';
import { ISantriRepository } from '../repositories/santri.repository.js';

export class CreateSantriUseCase {
  constructor(private santriRepo: ISantriRepository) {}

  /**
   * Executing enrollment creation of new student.
   */
  async execute(params: {
    tenantId: string;
    kelasId: string;
    userId: string | null; // Wali parent
    nis: string;
    nama: string;
    namaBapak?: string | null;
    namaIbu?: string | null;
    alamat?: string | null;
  }): Promise<Santri> {
    // 1. Check NIS uniqueness in tenant
    const existing = await this.santriRepo.findByNis(params.tenantId, params.nis);
    if (existing) {
      throw new Error(`Santri with NIS "${params.nis}" already exists in this tenant`);
    }

    // 2. Check Class validity
    const targetClass = await this.santriRepo.findClassById(params.tenantId, params.kelasId);
    if (!targetClass) {
      throw new Error(`Class with ID "${params.kelasId}" not found`);
    }

    // 3. Register Santri
    return this.santriRepo.create(params.tenantId, {
      userId: params.userId,
      kelasId: params.kelasId,
      nis: params.nis,
      nama: params.nama,
      namaBapak: params.namaBapak || null,
      namaIbu: params.namaIbu || null,
      alamat: params.alamat || null,
    });
  }
}
