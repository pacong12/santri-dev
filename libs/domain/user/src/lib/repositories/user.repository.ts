import { User, Membership, TenantRole } from '../entities/user.entity.js';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<(User & { passwordHash: string }) | null>;
  create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> & { passwordHash: string }): Promise<User>;
  update(id: string, data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>): Promise<User>;
  delete(id: string): Promise<User>; // Soft delete
  getMemberships(userId: string): Promise<Membership[]>;
  addMembership(userId: string, tenantId: string, role: TenantRole): Promise<Membership>;
  removeMembership(userId: string, tenantId: string): Promise<void>;
}
