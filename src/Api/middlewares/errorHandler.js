import { AppError } from '../../Domain/entities/AppError.js';

export function errorHandler(err, _req, res, _next) {
  const statusCode =
    err instanceof AppError ? err.statusCode : err.statusCode ?? 500;

  const message =
    statusCode === 500 && process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message;

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    code: statusCode,
    success: false,
    error: message,
  });
}
