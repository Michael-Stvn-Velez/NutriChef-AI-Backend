import { GoogleGenAI } from '@google/genai';
import { AppError } from '../../Domain/entities/AppError.js';
import { IRecipeGeneratorService } from '../../Domain/interfaces/Recipe/IRecipeGeneratorService.js';
import {
  geminiRecipeAiResponseSchema,
  geminiRecipeSystemPrompt,
} from '../config/geminiRecipeAiConfig.js';
import { env } from '../config/env.js';

export class GeminiRecipeGeneratorService extends IRecipeGeneratorService {
  constructor() {
    super();
    this.geminiAiClient = new GoogleGenAI({ apiKey: env.geminiApiKey });
  }

  #buildIngredientsPromptText(ingredientList) {
    return ingredientList
      .map((ingredientItem) => `- ${ingredientItem.name}: ${ingredientItem.quantity}`)
      .join('\n');
  }

  #parseAiJsonResponseToObject(aiResponseText) {
    const trimmedResponseText = aiResponseText.trim();
    const jsonContentMatch = trimmedResponseText.match(/\{[\s\S]*\}/);

    if (!jsonContentMatch) {
      throw new AppError('La IA no devolvió un formato válido', 502);
    }

    try {
      return JSON.parse(jsonContentMatch[0]);
    } catch {
      throw new AppError('La IA no devolvió un formato válido', 502);
    }
  }

  async generateRecipeResponseWithAi(ingredientList) {
    if (!env.geminiApiKey) {
      throw new AppError('GEMINI_API_KEY no está configurada', 500);
    }

    const ingredientsPromptText = this.#buildIngredientsPromptText(ingredientList);

    try {
      const geminiApiResponse = await this.geminiAiClient.models.generateContent({
        model: env.geminiModel,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${geminiRecipeSystemPrompt}\n\nIngredientes:\n${ingredientsPromptText}`,
              },
            ],
          },
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: geminiRecipeAiResponseSchema,
        },
      });

      const parsedAiRecipeResponse = this.#parseAiJsonResponseToObject(
        geminiApiResponse.text ?? ''
      );

      if (
        !parsedAiRecipeResponse.title ||
        !Array.isArray(parsedAiRecipeResponse.steps) ||
        !parsedAiRecipeResponse.nutritionTable
      ) {
        throw new AppError('La IA devolvió una receta incompleta', 502);
      }

      return {
        title: parsedAiRecipeResponse.title.trim(),
        steps: parsedAiRecipeResponse.steps
          .map((recipeStep) => String(recipeStep).trim())
          .filter(Boolean),
        nutritionTable: {
          calories: String(parsedAiRecipeResponse.nutritionTable.calories ?? ''),
          protein: String(parsedAiRecipeResponse.nutritionTable.protein ?? ''),
          carbs: String(parsedAiRecipeResponse.nutritionTable.carbs ?? ''),
          fat: String(parsedAiRecipeResponse.nutritionTable.fat ?? ''),
          fiber: String(parsedAiRecipeResponse.nutritionTable.fiber ?? ''),
          sodium: String(parsedAiRecipeResponse.nutritionTable.sodium ?? ''),
        },
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      console.error('GeminiRecipeGeneratorService:', error);
      throw new AppError('Error al generar la receta con IA', 502);
    }
  }
}
