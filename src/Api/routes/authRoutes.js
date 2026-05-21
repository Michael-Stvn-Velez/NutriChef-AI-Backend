import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';

export function createAuthRoutes({ authController }) {
  const router = Router();

  router.post('/register', asyncHandler(authController.register));
  router.post('/login', asyncHandler(authController.login));
  router.post('/forgot-password', asyncHandler(authController.forgotPassword));
  router.post('/reset-password', asyncHandler(authController.resetPassword));

  return router;
}
