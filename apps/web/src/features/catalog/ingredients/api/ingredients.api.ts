import { apiClient } from '../../../../lib/api-client';
import { safeRequest } from '../../../../shared/lib/safe-request';
import type { Either } from '../../../../shared/types/either';
import type { ApiError } from '../../../../shared/types/api-error';

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
  getAll: (): Promise<Either<ApiError, Ingredient[]>> =>
    safeRequest(() =>
      apiClient.get<Ingredient[]>('/ingredients').then((r) => r.data),
    ),

  getOne: (id: string): Promise<Either<ApiError, Ingredient>> =>
    safeRequest(() =>
      apiClient.get<Ingredient>(`/ingredients/${id}`).then((r) => r.data),
    ),

  create: (data: CreateIngredientDto): Promise<Either<ApiError, Ingredient>> =>
    safeRequest(() =>
      apiClient.post<Ingredient>('/ingredients', data).then((r) => r.data),
    ),

  update: (
    id: string,
    data: UpdateIngredientDto,
  ): Promise<Either<ApiError, Ingredient>> =>
    safeRequest(() =>
      apiClient
        .patch<Ingredient>(`/ingredients/${id}`, data)
        .then((r) => r.data),
    ),

  remove: (id: string): Promise<Either<ApiError, void>> =>
    safeRequest(() =>
      apiClient.delete(`/ingredients/${id}`).then(() => undefined),
    ),
};
