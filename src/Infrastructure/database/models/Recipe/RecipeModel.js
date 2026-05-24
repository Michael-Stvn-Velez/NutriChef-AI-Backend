import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const nutritionTableSchema = new mongoose.Schema(
  {
    calories: { type: String, default: '' },
    protein: { type: String, default: '' },
    carbs: { type: String, default: '' },
    fat: { type: String, default: '' },
    fiber: { type: String, default: '' },
    sodium: { type: String, default: '' },
  },
  { _id: false }
);

const recipeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    ingredients: { type: [ingredientSchema], required: true },
    steps: { type: [String], required: true },
    nutritionTable: { type: nutritionTableSchema, required: true },
  },
  { timestamps: true }
);

export const RecipeModel = mongoose.model('Recipe', recipeSchema);
