import { Tenant } from '../entities/tenant.entity.js';
import { ITenantRepository } from '../repositories/tenant.repository.js';

export class GetTenantsUseCase {
  constructor(private tenantRepo: ITenantRepository) {}

  async execute(): Promise<Tenant[]> {
    return this.tenantRepo.findManyActive();
  }
}
