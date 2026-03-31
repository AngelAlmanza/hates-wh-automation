import { z } from 'zod';

export const ingredientSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'Máximo 100 caracteres'),
});

export type IngredientFormData = z.infer<typeof ingredientSchema>;
