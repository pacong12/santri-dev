import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: any, secret: string, expiresIn: any = '1d'): string {
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyToken<T = any>(token: string, secret: string): T {
  return jwt.verify(token, secret) as T;
}
