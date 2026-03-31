import { z } from 'zod';

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'Máximo 100 caracteres'),
  description: z
    .string()
    .max(500, 'Máximo 500 caracteres')
    .optional()
    .or(z.literal('')),
  sortOrder: z
    .number()
    .int('Debe ser un número entero')
    .min(0, 'Debe ser mayor o igual a 0')
    .optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
