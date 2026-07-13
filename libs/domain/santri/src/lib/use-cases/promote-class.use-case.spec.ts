import { describe, it, expect, vi } from 'vitest';
import { PromoteClassUseCase } from './promote-class.use-case.js';
import { ISantriRepository } from '../repositories/santri.repository.js';
import { Santri } from '../entities/santri.entity.js';

describe('PromoteClassUseCase', () => {
  const mockSantri: Santri = {
    id: 'santri-123',
    tenantId: 'tenant-abc',
    nis: '123456',
    nama: 'Ahmad Fauzi',
    kelasId: 'kelas-old',
    namaBapak: 'Budi',
    namaIbu: 'Siti',
    alamat: 'Ponorogo',
    userId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockClass = {
    id: 'kelas-new',
    tenantId: 'tenant-abc',
    nama: 'Kelas 8A',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  it('should successfully promote class of a santri and record mutation history', async () => {
    const mockSantriRepo = {
      findById: vi.fn().mockResolvedValue(mockSantri),
      findClassById: vi.fn().mockResolvedValue(mockClass),
      update: vi.fn().mockImplementation((tenantId, id, data) => Promise.resolve({ ...mockSantri, ...data })),
      addHistory: vi.fn().mockResolvedValue({}),
    } as unknown as ISantriRepository;

    const useCase = new PromoteClassUseCase(mockSantriRepo);

    const result = await useCase.execute({
      tenantId: 'tenant-abc',
      santriId: 'santri-123',
      newKelasId: 'kelas-new',
    });

    expect(result.kelasId).toBe('kelas-new');
    expect(mockSantriRepo.findById).toHaveBeenCalledWith('tenant-abc', 'santri-123');
    expect(mockSantriRepo.findClassById).toHaveBeenCalledWith('tenant-abc', 'kelas-new');
    expect(mockSantriRepo.update).toHaveBeenCalledWith('tenant-abc', 'santri-123', {
      kelasId: 'kelas-new',
    });
    expect(mockSantriRepo.addHistory).toHaveBeenCalledWith({
      tenantId: 'tenant-abc',
      santriId: 'santri-123',
      kelasLamaId: 'kelas-old',
      kelasBaruId: 'kelas-new',
    });
  });

  it('should throw an error if the santri is not found', async () => {
    const mockSantriRepo = {
      findById: vi.fn().mockResolvedValue(null),
    } as unknown as ISantriRepository;

    const useCase = new PromoteClassUseCase(mockSantriRepo);

    await expect(
      useCase.execute({
        tenantId: 'tenant-abc',
        santriId: 'santri-nonexistent',
        newKelasId: 'kelas-new',
      })
    ).rejects.toThrow('Santri with ID santri-nonexistent not found');
  });

  it('should throw an error if the target class is not found', async () => {
    const mockSantriRepo = {
      findById: vi.fn().mockResolvedValue(mockSantri),
      findClassById: vi.fn().mockResolvedValue(null),
    } as unknown as ISantriRepository;

    const useCase = new PromoteClassUseCase(mockSantriRepo);

    await expect(
      useCase.execute({
        tenantId: 'tenant-abc',
        santriId: 'santri-123',
        newKelasId: 'kelas-nonexistent',
      })
    ).rejects.toThrow('Class with ID kelas-nonexistent not found');
  });
});
