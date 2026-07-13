import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword, signToken, verifyToken } from './auth.js';

describe('Auth Infrastructure Helpers', () => {
  const secretKey = 'my-super-secret-key-123';
  const rawPassword = 'myPassword123';

  it('should hash password and match it correctly', async () => {
    const hashed = await hashPassword(rawPassword);
    expect(hashed).toBeDefined();
    expect(hashed).not.toBe(rawPassword);

    const isMatch = await comparePassword(rawPassword, hashed);
    expect(isMatch).toBe(true);

    const isNotMatch = await comparePassword('wrongPassword', hashed);
    expect(isNotMatch).toBe(false);
  });

  it('should sign and verify JWT token successfully', () => {
    const payload = { userId: '123', email: 'user@example.com' };
    const token = signToken(payload, secretKey, '1h');
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');

    const decoded = verifyToken<{ userId: string; email: string }>(token, secretKey);
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.email).toBe(payload.email);
  });

  it('should throw error when verifying invalid token', () => {
    expect(() => verifyToken('invalid-token-here', secretKey)).toThrow();
  });
});
