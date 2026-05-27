import { AppError } from '../../../Domain/entities/AppError.js';

export class RefreshTokenUseCase {
  constructor(tokenService) {
    this.tokenService = tokenService;
  }

  async execute(refreshToken) {
    try {
      const plainRefreshToken = refreshToken?.trim() ?? '';

      if (!plainRefreshToken) {
        throw new AppError('Refresh token is required', 401);
      }

      const payload = this.tokenService.verifyRefreshToken(plainRefreshToken);

      if (!payload?.userId) {
        throw new AppError('Invalid refresh token', 401);
      }

      const tokenPayload = {
        userId: payload.userId,
        email: payload.email ?? null,
      };

      const accessToken = this.tokenService.generateAccessToken(tokenPayload);
      const newRefreshToken = this.tokenService.generateRefreshToken(tokenPayload);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      if (error.name === 'TokenExpiredError') {
        throw new AppError('Refresh token has expired', 401);
      }

      if (error.name === 'JsonWebTokenError') {
        throw new AppError('Invalid refresh token', 401);
      }

      console.error('RefreshTokenUseCase:', error);
      throw new AppError('Error refreshing token', 500);
    }
  }
}
