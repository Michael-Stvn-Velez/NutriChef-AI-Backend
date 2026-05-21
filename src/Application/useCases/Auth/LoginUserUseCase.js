import { AppError } from '../../../Domain/entities/AppError.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class LoginUserUseCase {
  constructor(loginUserRepository, tokenService) {
    this.loginUserRepository = loginUserRepository;
    this.tokenService = tokenService;
  }

  async execute(email, password) {
    try {
      const normalizedEmail = email?.trim().toLowerCase() ?? '';
      const plainPassword = password ?? '';

      if (!normalizedEmail) {
        throw new AppError('Email is required', 400);
      }

      if (!EMAIL_REGEX.test(normalizedEmail)) {
        throw new AppError('Invalid email', 400);
      }

      if (!plainPassword) {
        throw new AppError('Password is required', 400);
      }

      const user = await this.loginUserRepository.loginUser(
        normalizedEmail,
        plainPassword
      );

      if (!user) {
        throw new AppError('Invalid email or password', 401);
      }

      const tokenPayload = { userId: user.id, email: user.email };

      const accessToken = this.tokenService.generateAccessToken(tokenPayload);
      const refreshToken = this.tokenService.generateRefreshToken(tokenPayload);

      return { user, accessToken, refreshToken };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      console.error('LoginUserUseCase:', error);
      throw new AppError('Error logging in user', 500);
    }
  }
}
