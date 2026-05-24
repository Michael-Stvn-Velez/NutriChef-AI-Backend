import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';

export function createRecipeRoutes({ recipeController, authMiddleware }) {
  const router = Router();

  router.use(authMiddleware);

  router.post('/', asyncHandler(recipeController.createRecipeFromIngredients));
  router.get('/', asyncHandler(recipeController.listUserRecipes));
  router.get('/:id', asyncHandler(recipeController.getRecipeDetailById));
  router.delete('/:id', asyncHandler(recipeController.deleteRecipeById));

  return router;
}
