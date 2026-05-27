import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';
import { ListRecipesUseCase } from '../../src/Application/useCases/Recipe/ListRecipesUseCase.js';
import { assertRejectsWithAppError } from '../helpers/assertAppError.js';

describe('ListRecipesUseCase', () => {
  it('lista recetas del usuario autenticado', async () => {
    const summaries = [{ id: '1', title: 'Receta A' }];
    const userRecipeRepository = {
      findAllRecipeSummariesByUserId: mock.fn(async () => summaries),
    };

    const useCase = new ListRecipesUseCase(userRecipeRepository);
    const result = await useCase.execute('user-1');

    assert.deepEqual(result, summaries);
    assert.equal(userRecipeRepository.findAllRecipeSummariesByUserId.mock.calls[0].arguments[0], 'user-1');
  });

  it('rechaza usuario no autenticado', async () => {
    const userRecipeRepository = {
      findAllRecipeSummariesByUserId: mock.fn(),
    };

    const useCase = new ListRecipesUseCase(userRecipeRepository);

    await assertRejectsWithAppError(() => useCase.execute(null), {
      message: 'User is not authenticated',
      statusCode: 401,
    });
  });
});
