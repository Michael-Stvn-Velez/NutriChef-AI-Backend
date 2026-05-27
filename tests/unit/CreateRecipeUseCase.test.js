import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';
import { CreateRecipeUseCase } from '../../src/Application/useCases/Recipe/CreateRecipeUseCase.js';
import { assertRejectsWithAppError } from '../helpers/assertAppError.js';

const VALID_AI_RESPONSE = {
  title: 'Ensalada de tomate',
  steps: ['Lavar', 'Cortar', 'Servir'],
  nutritionTable: {
    calories: '50 kcal',
    protein: '2 g',
    carbs: '10 g',
    fat: '1 g',
    fiber: '2 g',
    sodium: '5 mg',
  },
};

const SAVED_RECIPE = {
  id: '507f1f77bcf86cd799439011',
  userId: 'user-1',
  title: 'Ensalada de tomate',
  ingredients: [{ name: 'tomate', quantity: '100g' }],
  steps: ['Lavar', 'Cortar', 'Servir'],
  nutritionTable: VALID_AI_RESPONSE.nutritionTable,
};

function createMocks({ aiResponse = VALID_AI_RESPONSE, savedRecipe = SAVED_RECIPE } = {}) {
  const userRecipeRepository = {
    saveGeneratedRecipeForUser: mock.fn(async () => savedRecipe),
  };

  const aiRecipeGeneratorService = {
    generateRecipeResponseWithAi: mock.fn(async () => aiResponse),
  };

  return { userRecipeRepository, aiRecipeGeneratorService };
}

describe('CreateRecipeUseCase', () => {
  it('crea una receta con ingredientes válidos', async () => {
    const { userRecipeRepository, aiRecipeGeneratorService } = createMocks();
    const useCase = new CreateRecipeUseCase(userRecipeRepository, aiRecipeGeneratorService);

    const ingredients = [{ name: '  tomate ', quantity: ' 100g ' }];
    const result = await useCase.execute('user-1', ingredients);

    assert.equal(result.id, SAVED_RECIPE.id);
    assert.equal(aiRecipeGeneratorService.generateRecipeResponseWithAi.mock.calls[0].arguments[0][0].name, 'tomate');
    assert.equal(
      userRecipeRepository.saveGeneratedRecipeForUser.mock.calls[0].arguments[0].userId,
      'user-1'
    );
  });

  it('rechaza usuario no autenticado', async () => {
    const { userRecipeRepository, aiRecipeGeneratorService } = createMocks();
    const useCase = new CreateRecipeUseCase(userRecipeRepository, aiRecipeGeneratorService);

    await assertRejectsWithAppError(
      () => useCase.execute(null, [{ name: 'tomate', quantity: '1' }]),
      { message: 'User is not authenticated', statusCode: 401 }
    );
  });

  it('rechaza lista de ingredientes vacía', async () => {
    const { userRecipeRepository, aiRecipeGeneratorService } = createMocks();
    const useCase = new CreateRecipeUseCase(userRecipeRepository, aiRecipeGeneratorService);

    await assertRejectsWithAppError(() => useCase.execute('user-1', []), {
      message: 'At least one ingredient is required',
      statusCode: 400,
    });
  });

  it('rechaza ingrediente sin nombre', async () => {
    const { userRecipeRepository, aiRecipeGeneratorService } = createMocks();
    const useCase = new CreateRecipeUseCase(userRecipeRepository, aiRecipeGeneratorService);

    await assertRejectsWithAppError(
      () => useCase.execute('user-1', [{ name: '  ', quantity: '1' }]),
      { message: /Ingredient name is required at index 0/, statusCode: 400 }
    );
  });

  it('rechaza si la IA devuelve receta sin pasos', async () => {
    const { userRecipeRepository, aiRecipeGeneratorService } = createMocks({
      aiResponse: { ...VALID_AI_RESPONSE, steps: [] },
    });
    const useCase = new CreateRecipeUseCase(userRecipeRepository, aiRecipeGeneratorService);

    await assertRejectsWithAppError(
      () => useCase.execute('user-1', [{ name: 'tomate', quantity: '1' }]),
      { message: 'La IA devolvió una receta sin pasos', statusCode: 502 }
    );
  });
});
