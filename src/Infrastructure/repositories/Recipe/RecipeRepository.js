import { Recipe } from '../../../Domain/entities/Recipe.js';
import { IRecipeRepository } from '../../../Domain/interfaces/Recipe/IRecipeRepository.js';
import { RecipeModel } from '../../database/models/Recipe/RecipeModel.js';

export class RecipeRepository extends IRecipeRepository {
  #mapDocumentToRecipeEntity(recipeDocument) {
    return new Recipe({
      id: recipeDocument._id.toString(),
      userId: recipeDocument.userId.toString(),
      title: recipeDocument.title,
      ingredients: recipeDocument.ingredients.map((ingredientItem) => ({
        name: ingredientItem.name,
        quantity: ingredientItem.quantity,
      })),
      steps: recipeDocument.steps,
      nutritionTable: {
        calories: recipeDocument.nutritionTable.calories ?? '',
        protein: recipeDocument.nutritionTable.protein ?? '',
        carbs: recipeDocument.nutritionTable.carbs ?? '',
        fat: recipeDocument.nutritionTable.fat ?? '',
        fiber: recipeDocument.nutritionTable.fiber ?? '',
        sodium: recipeDocument.nutritionTable.sodium ?? '',
      },
      createdAt: recipeDocument.createdAt,
      updatedAt: recipeDocument.updatedAt,
    });
  }

  #mapDocumentToRecipeSummaryEntity(recipeDocument) {
    return new Recipe({
      id: recipeDocument._id.toString(),
      userId: recipeDocument.userId.toString(),
      title: recipeDocument.title,
      ingredients: [],
      steps: [],
      nutritionTable: {},
      createdAt: recipeDocument.createdAt,
      updatedAt: recipeDocument.updatedAt,
    });
  }

  async saveGeneratedRecipeForUser(recipeDataToSave) {
    const savedRecipeDocument = await RecipeModel.create({
      userId: recipeDataToSave.userId,
      title: recipeDataToSave.title,
      ingredients: recipeDataToSave.ingredients,
      steps: recipeDataToSave.steps,
      nutritionTable: recipeDataToSave.nutritionTable,
    });

    return this.#mapDocumentToRecipeEntity(savedRecipeDocument);
  }

  async findAllRecipeSummariesByUserId(userId) {
    const recipeDocuments = await RecipeModel.find({ userId })
      .select('userId title createdAt updatedAt')
      .sort({ createdAt: -1 });

    return recipeDocuments.map((recipeDocument) =>
      this.#mapDocumentToRecipeSummaryEntity(recipeDocument)
    );
  }

  async findRecipeDetailByIdAndUserId(recipeId, userId) {
    const recipeDocument = await RecipeModel.findOne({ _id: recipeId, userId });

    if (!recipeDocument) {
      return null;
    }

    return this.#mapDocumentToRecipeEntity(recipeDocument);
  }

  async removeRecipeByIdAndUserId(recipeId, userId) {
    const deleteResult = await RecipeModel.deleteOne({ _id: recipeId, userId });
    return deleteResult.deletedCount > 0;
  }
}
