import { Router } from 'express';
import { createAuthRoutes } from './authRoutes.js';

export function createApiRouter(dependencies) {
  const router = Router();

  router.use('/auth', createAuthRoutes(dependencies));

  return router;
}
