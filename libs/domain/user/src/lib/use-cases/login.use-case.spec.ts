import { describe, it, expect, vi } from 'vitest';
import { LoginUseCase } from './login.use-case.js';
import { IUserRepository } from '../repositories/user.repository.js';
import { User, Membership, TenantRole } from '../entities/user.entity.js';

describe('LoginUseCase', () => {
  const mockUser = {
    id: 'user-123',
    username: 'testuser',
    email: 'test@example.com',
    name: 'Test User',
    passwordHash: 'hashed_password',
    platformRole: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockMemberships: Membership[] = [
    {
      id: 'membership-1',
      userId: 'user-123',
      tenantId: 'tenant-abc',
      role: TenantRole.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  it('should log in successfully with correct credentials', async () => {
    const mockUserRepo = {
      findByEmail: vi.fn().mockResolvedValue(mockUser),
      getMemberships: vi.fn().mockResolvedValue(mockMemberships),
    } as unknown as IUserRepository;

    const mockVerifyPassword = vi.fn().mockResolvedValue(true);
    const mockGenerateToken = vi.fn().mockResolvedValue('jwt_token_xyz');

    const useCase = new LoginUseCase(mockUserRepo, mockVerifyPassword, mockGenerateToken);

    const result = await useCase.execute({
      email: 'test@example.com',
      plainPassword: 'password123',
    });

    expect(result.token).toBe('jwt_token_xyz');
    expect(result.user.email).toBe('test@example.com');
    expect(result.memberships).toEqual(mockMemberships);
    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockVerifyPassword).toHaveBeenCalledWith('password123', 'hashed_password');
    expect(mockGenerateToken).toHaveBeenCalledWith({
      userId: 'user-123',
      email: 'test@example.com',
      platformRole: null,
      memberships: [{ tenantId: 'tenant-abc', role: TenantRole.ADMIN }],
    });
  });

  it('should throw an error if user is not found', async () => {
    const mockUserRepo = {
      findByEmail: vi.fn().mockResolvedValue(null),
    } as unknown as IUserRepository;

    const mockVerifyPassword = vi.fn();
    const mockGenerateToken = vi.fn();

    const useCase = new LoginUseCase(mockUserRepo, mockVerifyPassword, mockGenerateToken);

    await expect(
      useCase.execute({
        email: 'wrong@example.com',
        plainPassword: 'password123',
      })
    ).rejects.toThrow('Invalid email or password');
  });

  it('should throw an error if password does not match', async () => {
    const mockUserRepo = {
      findByEmail: vi.fn().mockResolvedValue(mockUser),
    } as unknown as IUserRepository;

    const mockVerifyPassword = vi.fn().mockResolvedValue(false);
    const mockGenerateToken = vi.fn();

    const useCase = new LoginUseCase(mockUserRepo, mockVerifyPassword, mockGenerateToken);

    await expect(
      useCase.execute({
        email: 'test@example.com',
        plainPassword: 'wrongpassword',
      })
    ).rejects.toThrow('Invalid email or password');
  });
});
