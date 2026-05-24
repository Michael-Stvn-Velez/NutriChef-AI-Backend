export class IRecipeRepository {
  /**
   * @param {object} recipeDataToSave
   * @param {string} recipeDataToSave.userId
   * @param {string} recipeDataToSave.title
   * @param {Array<{ name: string, quantity: string }>} recipeDataToSave.ingredients
   * @param {string[]} recipeDataToSave.steps
   * @param {object} recipeDataToSave.nutritionTable
   * @returns {Promise<import('../../entities/Recipe.js').Recipe>}
   */
  async saveGeneratedRecipeForUser(recipeDataToSave) {
    throw new Error('saveGeneratedRecipeForUser must be implemented');
  }

  /**
   * @param {string} userId
   * @returns {Promise<import('../../entities/Recipe.js').Recipe[]>}
   */
  async findAllRecipeSummariesByUserId(userId) {
    throw new Error('findAllRecipeSummariesByUserId must be implemented');
  }

  /**
   * @param {string} recipeId
   * @param {string} userId
   * @returns {Promise<import('../../entities/Recipe.js').Recipe | null>}
   */
  async findRecipeDetailByIdAndUserId(recipeId, userId) {
    throw new Error('findRecipeDetailByIdAndUserId must be implemented');
  }

  /**
   * @param {string} recipeId
   * @param {string} userId
   * @returns {Promise<boolean>}
   */
  async removeRecipeByIdAndUserId(recipeId, userId) {
    throw new Error('removeRecipeByIdAndUserId must be implemented');
  }
}
