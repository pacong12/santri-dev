import { StatusTagihan, BillingPeriod } from '@org/shared-enums';
export { StatusTagihan, BillingPeriod };

export interface Tagihan {
  id: string;
  tenantId: string;
  santriId: string;
  jenisTagihanId: string;
  tahunAjaranId: string | null;
  nama: string;
  amount: bigint;
  periode: string;
  status: StatusTagihan;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface JenisTagihan {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface KelasPayment {
  id: string;
  tenantId: string;
  kelasId: string;
  jenisTagihanId: string;
  amount: bigint;
  periode: BillingPeriod;
}
