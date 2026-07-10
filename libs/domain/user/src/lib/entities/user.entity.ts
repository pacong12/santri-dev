import { PlatformRole, TenantRole } from '@org/shared-enums';
export { PlatformRole, TenantRole };

export interface User {
  id: string;
  username: string;
  email: string;
  name: string | null;
  platformRole: PlatformRole | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface Membership {
  id: string;
  userId: string;
  tenantId: string;
  role: TenantRole;
  createdAt: Date;
  tenant?: {
    id: string;
    name: string;
  };
}
