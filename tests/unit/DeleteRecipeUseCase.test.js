import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';
import { DeleteRecipeUseCase } from '../../src/Application/useCases/Recipe/DeleteRecipeUseCase.js';
import { assertRejectsWithAppError } from '../helpers/assertAppError.js';

const VALID_RECIPE_ID = '507f1f77bcf86cd799439011';

function createMocks({ deleted = true } = {}) {
  const userRecipeRepository = {
    removeRecipeByIdAndUserId: mock.fn(async () => deleted),
  };

  return { userRecipeRepository };
}

describe('DeleteRecipeUseCase', () => {
  it('elimina una receta existente', async () => {
    const { userRecipeRepository } = createMocks();
    const useCase = new DeleteRecipeUseCase(userRecipeRepository);

    const result = await useCase.execute('user-1', VALID_RECIPE_ID);

    assert.equal(result.message, 'Recipe deleted successfully');
  });

  it('rechaza si la receta no existe', async () => {
    const { userRecipeRepository } = createMocks({ deleted: false });
    const useCase = new DeleteRecipeUseCase(userRecipeRepository);

    await assertRejectsWithAppError(() => useCase.execute('user-1', VALID_RECIPE_ID), {
      message: 'Recipe not found',
      statusCode: 404,
    });
  });

  it('rechaza usuario no autenticado', async () => {
    const { userRecipeRepository } = createMocks();
    const useCase = new DeleteRecipeUseCase(userRecipeRepository);

    await assertRejectsWithAppError(() => useCase.execute(null, VALID_RECIPE_ID), {
      message: 'User is not authenticated',
      statusCode: 401,
    });
  });
});
