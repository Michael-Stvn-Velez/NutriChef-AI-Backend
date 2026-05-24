import { AppError } from '../../../Domain/entities/AppError.js';
import mongoose from 'mongoose';

export class DeleteRecipeUseCase {
  constructor(userRecipeRepository) {
    this.userRecipeRepository = userRecipeRepository;
  }

  async execute(authenticatedUserId, recipeId) {
    try {
      if (!authenticatedUserId) {
        throw new AppError('User is not authenticated', 401);
      }

      if (!recipeId?.trim()) {
        throw new AppError('Recipe id is required', 400);
      }

      const normalizedRecipeId = recipeId.trim();

      if (!mongoose.Types.ObjectId.isValid(normalizedRecipeId)) {
        throw new AppError('Recipe not found', 404);
      }

      const wasRecipeDeleted =
        await this.userRecipeRepository.removeRecipeByIdAndUserId(
          normalizedRecipeId,
          authenticatedUserId
        );

      if (!wasRecipeDeleted) {
        throw new AppError('Recipe not found', 404);
      }

      return { message: 'Recipe deleted successfully' };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      console.error('DeleteRecipeUseCase:', error);
      throw new AppError('Error deleting recipe', 500);
    }
  }
}
