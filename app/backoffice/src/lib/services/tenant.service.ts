import { fetchApi } from '../api-client';

export interface TenantDetails {
  id: string;
  name: string;
  sppTariff?: number | null;
  bankAccount?: string | null;
}

export class TenantService {
  static async getTenantProfile(tenantId: string): Promise<TenantDetails> {
    const response = await fetchApi<TenantDetails>(`/tenants/${tenantId}`);
    if (!response.data) {
      throw new Error('Data tenant tidak ditemukan');
    }
    return response.data;
  }
}
