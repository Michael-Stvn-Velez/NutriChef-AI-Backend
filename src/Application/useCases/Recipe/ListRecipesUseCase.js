import { AppError } from '../../../Domain/entities/AppError.js';

export class ListRecipesUseCase {
  constructor(userRecipeRepository) {
    this.userRecipeRepository = userRecipeRepository;
  }

  async execute(authenticatedUserId) {
    try {
      if (!authenticatedUserId) {
        throw new AppError('User is not authenticated', 401);
      }

      return await this.userRecipeRepository.findAllRecipeSummariesByUserId(
        authenticatedUserId
      );
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      console.error('ListRecipesUseCase:', error);
      throw new AppError('Error listing recipes', 500);
    }
  }
}
