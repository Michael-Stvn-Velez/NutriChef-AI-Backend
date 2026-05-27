import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';
import { GetRecipeByIdUseCase } from '../../src/Application/useCases/Recipe/GetRecipeByIdUseCase.js';
import { assertRejectsWithAppError } from '../helpers/assertAppError.js';

const VALID_RECIPE_ID = '507f1f77bcf86cd799439011';

function createMocks({ recipe = { id: VALID_RECIPE_ID, title: 'Test' } } = {}) {
  const userRecipeRepository = {
    findRecipeDetailByIdAndUserId: mock.fn(async () => recipe),
  };

  return { userRecipeRepository };
}

describe('GetRecipeByIdUseCase', () => {
  it('devuelve el detalle de una receta existente', async () => {
    const { userRecipeRepository } = createMocks();
    const useCase = new GetRecipeByIdUseCase(userRecipeRepository);

    const result = await useCase.execute('user-1', VALID_RECIPE_ID);

    assert.equal(result.title, 'Test');
    assert.equal(
      userRecipeRepository.findRecipeDetailByIdAndUserId.mock.calls[0].arguments[0],
      VALID_RECIPE_ID
    );
  });

  it('rechaza id vacío', async () => {
    const { userRecipeRepository } = createMocks();
    const useCase = new GetRecipeByIdUseCase(userRecipeRepository);

    await assertRejectsWithAppError(() => useCase.execute('user-1', '  '), {
      message: 'Recipe id is required',
      statusCode: 400,
    });
  });

  it('rechaza id con formato inválido', async () => {
    const { userRecipeRepository } = createMocks();
    const useCase = new GetRecipeByIdUseCase(userRecipeRepository);

    await assertRejectsWithAppError(() => useCase.execute('user-1', 'no-es-objectid'), {
      message: 'Recipe not found',
      statusCode: 404,
    });
  });

  it('rechaza receta no encontrada', async () => {
    const { userRecipeRepository } = createMocks({ recipe: null });
    const useCase = new GetRecipeByIdUseCase(userRecipeRepository);

    await assertRejectsWithAppError(() => useCase.execute('user-1', VALID_RECIPE_ID), {
      message: 'Recipe not found',
      statusCode: 404,
    });
  });
});
