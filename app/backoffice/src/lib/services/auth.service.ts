import { fetchApi } from '../api-client';
import { z } from 'zod';
import { CreateUserSchema, LoginSchema } from '@org/shared-validation';
import type { User, Membership } from '@org/domain-user';

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;

export interface LoginResponse {
  token: string;
  user: User;
  memberships: Membership[];
}

export class AuthService {
  static async login(data: LoginDto): Promise<LoginResponse> {
    const response = await fetchApi<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.data) {
      throw new Error('Data login tidak valid');
    }
    return response.data;
  }

  static async register(data: CreateUserDto): Promise<unknown> {
    const response = await fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }
}
