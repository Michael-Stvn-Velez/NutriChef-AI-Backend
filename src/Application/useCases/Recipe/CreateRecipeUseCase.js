import { AppError } from '../../../Domain/entities/AppError.js';

function validateAndNormalizeIngredientList(rawIngredientList) {
  if (!Array.isArray(rawIngredientList) || rawIngredientList.length === 0) {
    throw new AppError('At least one ingredient is required', 400);
  }

  return rawIngredientList.map((ingredientItem, ingredientIndex) => {
    const ingredientName = ingredientItem?.name?.trim() ?? '';
    const ingredientQuantity = ingredientItem?.quantity?.trim() ?? '';

    if (!ingredientName) {
      throw new AppError(
        `Ingredient name is required at index ${ingredientIndex}`,
        400
      );
    }

    if (!ingredientQuantity) {
      throw new AppError(
        `Ingredient quantity is required at index ${ingredientIndex}`,
        400
      );
    }

    return { name: ingredientName, quantity: ingredientQuantity };
  });
}

export class CreateRecipeUseCase {
  constructor(userRecipeRepository, aiRecipeGeneratorService) {
    this.userRecipeRepository = userRecipeRepository;
    this.aiRecipeGeneratorService = aiRecipeGeneratorService;
  }

  async execute(authenticatedUserId, rawIngredientList) {
    try {
      if (!authenticatedUserId) {
        throw new AppError('User is not authenticated', 401);
      }

      const validatedIngredientList =
        validateAndNormalizeIngredientList(rawIngredientList);

      const aiGeneratedRecipeContent =
        await this.aiRecipeGeneratorService.generateRecipeResponseWithAi(
          validatedIngredientList
        );

      if (aiGeneratedRecipeContent.steps.length === 0) {
        throw new AppError('La IA devolvió una receta sin pasos', 502);
      }

      const recipeDataToSave = {
        userId: authenticatedUserId,
        title: aiGeneratedRecipeContent.title,
        ingredients: validatedIngredientList,
        steps: aiGeneratedRecipeContent.steps,
        nutritionTable: aiGeneratedRecipeContent.nutritionTable,
      };

      return await this.userRecipeRepository.saveGeneratedRecipeForUser(
        recipeDataToSave
      );
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      console.error('CreateRecipeUseCase:', error);
      throw new AppError('Error creating recipe', 500);
    }
  }
}
