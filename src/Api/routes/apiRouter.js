import { Router } from 'express';
import { createAuthRoutes } from './authRoutes.js';
import { createRecipeRoutes } from './recipeRoutes.js';

export function createApiRouter(dependencies) {
  const router = Router();

  router.use('/auth', createAuthRoutes(dependencies));
  router.use('/recipes', createRecipeRoutes(dependencies));

  return router;
}
