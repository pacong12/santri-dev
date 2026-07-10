import { Controller, Post, Body, BadRequestException, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateUserSchema, LoginSchema } from '@org/shared-validation';
import { PrismaUserRepository } from '@org/database';
import { hashPassword, comparePassword, signToken } from '@org/auth';
import { LoginUseCase } from '@org/domain-user';
import { ApiResponse } from '@org/shared-types';

@Controller('auth')
export class AuthController {
  private readonly userRepo = new PrismaUserRepository();
  private readonly loginUseCase: LoginUseCase;

  constructor() {
    const secret = process.env['JWT_SECRET'] || 'generate-a-secure-random-secret-key-32-chars-or-more';
    this.loginUseCase = new LoginUseCase(
      this.userRepo,
      async (plain: string, hashed: string) => comparePassword(plain, hashed),
      async (payload: {
        userId: string;
        email: string;
        platformRole: string | null;
        memberships: Array<{ tenantId: string; role: string }>;
      }) => signToken(payload, secret)
    );
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: Record<string, unknown>): Promise<ApiResponse> {
    const parseResult = CreateUserSchema.safeParse(body);
    if (!parseResult.success) {
      const errorMessages = parseResult.error.issues.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new BadRequestException({
        success: false,
        message: 'Validation failed',
        errors: errorMessages,
      });
    }

    const { username, email, password, name } = parseResult.data;

    try {
      const existingUser = await this.userRepo.findByEmail(email);
      if (existingUser) {
        throw new BadRequestException({
          success: false,
          message: `User with email "${email}" is already registered`,
        });
      }

      const passwordHash = await hashPassword(password);
      const user = await this.userRepo.create({
        username,
        email,
        passwordHash,
        name: name || null,
        platformRole: null,
      });

      return {
        success: true,
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          platformRole: user.platformRole,
          createdAt: user.createdAt,
        },
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Registration failed',
      });
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: Record<string, unknown>): Promise<ApiResponse> {
    const parseResult = LoginSchema.safeParse(body);
    if (!parseResult.success) {
      const errorMessages = parseResult.error.issues.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new BadRequestException({
        success: false,
        message: 'Validation failed',
        errors: errorMessages,
      });
    }

    const { email, password } = parseResult.data;

    try {
      const result = await this.loginUseCase.execute({
        email,
        plainPassword: password,
      });

      return {
        success: true,
        data: result,
      };
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        message: (error as Error).message || 'Login failed',
      });
    }
  }
}
