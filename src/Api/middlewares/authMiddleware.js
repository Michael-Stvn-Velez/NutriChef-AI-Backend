import { AppError } from '../../Domain/entities/AppError.js';

export function createAuthMiddleware(tokenService) {
  return (req, _res, next) => {
    try {
      const authHeader = req.headers.authorization ?? '';
      const [scheme, token] = authHeader.split(' ');

      if (scheme !== 'Bearer' || !token) {
        throw new AppError('Authentication token is required', 401);
      }

      const payload = tokenService.verifyAccessToken(token);

      if (!payload?.userId) {
        throw new AppError('Invalid authentication token', 401);
      }

      req.userId = payload.userId;
      req.userEmail = payload.email ?? null;
      next();
    } catch (error) {
      if (error instanceof AppError) {
        return next(error);
      }

      if (error.name === 'TokenExpiredError') {
        return next(new AppError('Authentication token has expired', 401));
      }

      if (error.name === 'JsonWebTokenError') {
        return next(new AppError('Invalid authentication token', 401));
      }

      return next(new AppError('Authentication failed', 401));
    }
  };
}
