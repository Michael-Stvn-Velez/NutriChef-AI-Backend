export class Recipe {
  constructor({
    id,
    userId,
    title,
    ingredients,
    steps,
    nutritionTable,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.ingredients = ingredients;
    this.steps = steps;
    this.nutritionTable = nutritionTable;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
