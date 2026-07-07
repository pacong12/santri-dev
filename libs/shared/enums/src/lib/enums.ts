export enum TenantStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  INACTIVE = 'INACTIVE',
}

export enum TenantRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  SANTRI = 'SANTRI',
}

export enum PlatformRole {
  SUPERADMIN = 'SUPERADMIN',
}

export enum StatusTagihan {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export enum BillingPeriod {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  ONCE = 'ONCE',
}

export enum StatusTransaksi {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
}
