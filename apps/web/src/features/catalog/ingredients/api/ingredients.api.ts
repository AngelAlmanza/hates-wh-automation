import { apiClient } from '../../../../lib/api-client';

export interface Ingredient {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIngredientDto {
  name: string;
}

export interface UpdateIngredientDto {
  name?: string;
}

export const ingredientsApi = {
  getAll: () =>
    apiClient.get<Ingredient[]>('/ingredients').then((r) => r.data),

  getOne: (id: string) =>
    apiClient.get<Ingredient>(`/ingredients/${id}`).then((r) => r.data),

  create: (data: CreateIngredientDto) =>
    apiClient.post<Ingredient>('/ingredients', data).then((r) => r.data),

  update: (id: string, data: UpdateIngredientDto) =>
    apiClient
      .patch<Ingredient>(`/ingredients/${id}`, data)
      .then((r) => r.data),

  remove: (id: string) => apiClient.delete(`/ingredients/${id}`),
};
