export function mapRecipeEntityToDetailResponse(recipeEntity) {
  return {
    id: recipeEntity.id,
    userId: recipeEntity.userId,
    title: recipeEntity.title,
    ingredients: recipeEntity.ingredients,
    steps: recipeEntity.steps,
    nutritionTable: recipeEntity.nutritionTable,
    createdAt: recipeEntity.createdAt,
    updatedAt: recipeEntity.updatedAt,
  };
}

export function mapRecipeEntityToSummaryResponse(recipeEntity) {
  return {
    id: recipeEntity.id,
    title: recipeEntity.title,
    createdAt: recipeEntity.createdAt,
    updatedAt: recipeEntity.updatedAt,
  };
}
