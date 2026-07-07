export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string;
  action: string;
  details: string | null;
  createdAt: Date;
}
