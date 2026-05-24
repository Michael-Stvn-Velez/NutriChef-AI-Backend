import { AppError } from '../../../Domain/entities/AppError.js';
import mongoose from 'mongoose';

export class GetRecipeByIdUseCase {
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

      const recipeDetail = await this.userRecipeRepository.findRecipeDetailByIdAndUserId(
        normalizedRecipeId,
        authenticatedUserId
      );

      if (!recipeDetail) {
        throw new AppError('Recipe not found', 404);
      }

      return recipeDetail;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      console.error('GetRecipeByIdUseCase:', error);
      throw new AppError('Error fetching recipe', 500);
    }
  }
}
