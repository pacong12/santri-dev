import { TenantStatus } from '@org/shared-enums';
export { TenantStatus };

export interface Tenant {
  id: string;
  name: string;
  code: string;
  status: TenantStatus;
  phone: string | null;
  address: string | null;
  gatewayAccountId: string | null;
  bankName: string | null;
  bankAccountNumber: string | null;
  bankAccountName: string | null;
  logoUrl: string | null;
  emailOfficial: string | null;
  defaultDueDays: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
