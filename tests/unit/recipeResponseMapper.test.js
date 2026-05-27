import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  mapRecipeEntityToDetailResponse,
  mapRecipeEntityToSummaryResponse,
} from '../../src/Api/mappers/recipeResponseMapper.js';

const recipeEntity = {
  id: '507f1f77bcf86cd799439011',
  userId: 'user-1',
  title: 'Ensalada',
  ingredients: [{ name: 'tomate', quantity: '100g' }],
  steps: ['Lavar', 'Servir'],
  nutritionTable: {
    calories: '50 kcal',
    protein: '2 g',
    carbs: '10 g',
    fat: '1 g',
    fiber: '2 g',
    sodium: '5 mg',
  },
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-02'),
};

describe('recipeResponseMapper', () => {
  it('mapRecipeEntityToDetailResponse incluye todos los campos', () => {
    const response = mapRecipeEntityToDetailResponse(recipeEntity);

    assert.equal(response.id, recipeEntity.id);
    assert.equal(response.userId, recipeEntity.userId);
    assert.equal(response.title, recipeEntity.title);
    assert.deepEqual(response.ingredients, recipeEntity.ingredients);
    assert.deepEqual(response.steps, recipeEntity.steps);
    assert.deepEqual(response.nutritionTable, recipeEntity.nutritionTable);
    assert.equal(response.createdAt, recipeEntity.createdAt);
    assert.equal(response.updatedAt, recipeEntity.updatedAt);
  });

  it('mapRecipeEntityToSummaryResponse solo expone campos de resumen', () => {
    const response = mapRecipeEntityToSummaryResponse(recipeEntity);

    assert.deepEqual(response, {
      id: recipeEntity.id,
      title: recipeEntity.title,
      createdAt: recipeEntity.createdAt,
      updatedAt: recipeEntity.updatedAt,
    });
    assert.equal('ingredients' in response, false);
    assert.equal('nutritionTable' in response, false);
  });
});
