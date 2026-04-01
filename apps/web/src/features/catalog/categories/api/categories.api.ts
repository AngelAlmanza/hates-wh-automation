import { apiClient } from '../../../../lib/api-client';
import { safeRequest } from '../../../../shared/lib/safe-request';
import type { Either } from '../../../../shared/types/either';
import type { ApiError } from '../../../../shared/types/api-error';

export interface Category {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  sortOrder?: number;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  sortOrder?: number;
}

export const categoriesApi = {
  getAll: (): Promise<Either<ApiError, Category[]>> =>
    safeRequest(() =>
      apiClient.get<Category[]>('/categories').then((r) => r.data),
    ),

  getOne: (id: string): Promise<Either<ApiError, Category>> =>
    safeRequest(() =>
      apiClient.get<Category>(`/categories/${id}`).then((r) => r.data),
    ),

  create: (data: CreateCategoryDto): Promise<Either<ApiError, Category>> =>
    safeRequest(() =>
      apiClient.post<Category>('/categories', data).then((r) => r.data),
    ),

  update: (
    id: string,
    data: UpdateCategoryDto,
  ): Promise<Either<ApiError, Category>> =>
    safeRequest(() =>
      apiClient.patch<Category>(`/categories/${id}`, data).then((r) => r.data),
    ),

  remove: (id: string): Promise<Either<ApiError, void>> =>
    safeRequest(() =>
      apiClient.delete(`/categories/${id}`).then(() => undefined),
    ),
};
