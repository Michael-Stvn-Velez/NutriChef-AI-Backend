import { Type } from '@google/genai';

export const geminiRecipeSystemPrompt = `Eres NutriChef, un asistente culinario y nutricional.
Con la lista de ingredientes y cantidades proporcionada, genera UNA receta completa.
Los valores nutricionales son aproximados por porción.
Responde únicamente con el JSON solicitado, sin texto adicional ni bloques markdown.`;

export const geminiRecipeAiResponseSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    steps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    nutritionTable: {
      type: Type.OBJECT,
      properties: {
        calories: { type: Type.STRING },
        protein: { type: Type.STRING },
        carbs: { type: Type.STRING },
        fat: { type: Type.STRING },
        fiber: { type: Type.STRING },
        sodium: { type: Type.STRING },
      },
      required: ['calories', 'protein', 'carbs', 'fat', 'fiber', 'sodium'],
    },
  },
  required: ['title', 'steps', 'nutritionTable'],
};
