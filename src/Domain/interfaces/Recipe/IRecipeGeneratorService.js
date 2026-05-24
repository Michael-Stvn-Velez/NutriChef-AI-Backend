export class IRecipeGeneratorService {
  /**
   * @param {Array<{ name: string, quantity: string }>} ingredientList
   * @returns {Promise<{ title: string, steps: string[], nutritionTable: object }>}
   */
  async generateRecipeResponseWithAi(ingredientList) {
    throw new Error('generateRecipeResponseWithAi must be implemented');
  }
}
