import {
  mapRecipeEntityToDetailResponse,
  mapRecipeEntityToSummaryResponse,
} from '../mappers/recipeResponseMapper.js';

export class RecipeController {
  constructor(
    createRecipeUseCase,
    listRecipesUseCase,
    getRecipeByIdUseCase,
    deleteRecipeUseCase
  ) {
    this.createRecipeUseCase = createRecipeUseCase;
    this.listRecipesUseCase = listRecipesUseCase;
    this.getRecipeByIdUseCase = getRecipeByIdUseCase;
    this.deleteRecipeUseCase = deleteRecipeUseCase;
  }

  createRecipeFromIngredients = async (req, res) => {
    const { ingredients: rawIngredientList } = req.body;

    const savedRecipe = await this.createRecipeUseCase.execute(
      req.userId,
      rawIngredientList
    );

    res.status(201).json({
      success: true,
      data: mapRecipeEntityToDetailResponse(savedRecipe),
    });
  };

  listUserRecipes = async (req, res) => {
    const userRecipeList = await this.listRecipesUseCase.execute(req.userId);

    res.status(200).json({
      success: true,
      data: userRecipeList.map(mapRecipeEntityToSummaryResponse),
    });
  };

  getRecipeDetailById = async (req, res) => {
    const recipeDetail = await this.getRecipeByIdUseCase.execute(
      req.userId,
      req.params.id
    );

    res.status(200).json({
      success: true,
      data: mapRecipeEntityToDetailResponse(recipeDetail),
    });
  };

  deleteRecipeById = async (req, res) => {
    const deleteRecipeResult = await this.deleteRecipeUseCase.execute(
      req.userId,
      req.params.id
    );

    res.status(200).json({
      success: true,
      data: deleteRecipeResult,
    });
  };
}
