import { User, Membership } from '../entities/user.entity.js';
import { IUserRepository } from '../repositories/user.repository.js';

export interface ILoginResult {
  user: Omit<User, 'password'>;
  memberships: Membership[];
  token: string;
}

export class LoginUseCase {
  constructor(
    private userRepo: IUserRepository,
    private verifyPassword: (plain: string, hashed: string) => Promise<boolean>,
    private generateToken: (payload: {
      userId: string;
      email: string;
      platformRole: string | null;
      memberships: Array<{ tenantId: string; role: string }>;
    }) => Promise<string>
  ) {}

  /**
   * Executing user login and credentials matching.
   */
  async execute(params: {
    email: string;
    plainPassword: string;
  }): Promise<ILoginResult> {
    const user = await this.userRepo.findByEmail(params.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password hash compatibility
    const isMatched = await this.verifyPassword(params.plainPassword, user.passwordHash);
    if (!isMatched) {
      throw new Error('Invalid email or password');
    }

    // Fetch memberships associated to this user
    const memberships = await this.userRepo.getMemberships(user.id);

    // Map claim records
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      platformRole: user.platformRole,
      memberships: memberships.map(m => ({
        tenantId: m.tenantId,
        role: m.role,
      })),
    };

    // Sign JWT Access Token
    const token = await this.generateToken(tokenPayload);

    // Exclude password from return payload
    const { passwordHash, ...userProfile } = user;

    return {
      user: userProfile,
      memberships,
      token,
    };
  }
}
