import { apiClient } from '../../../../lib/api-client';

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
  getAll: () => apiClient.get<Category[]>('/categories').then((r) => r.data),

  getOne: (id: string) =>
    apiClient.get<Category>(`/categories/${id}`).then((r) => r.data),

  create: (data: CreateCategoryDto) =>
    apiClient.post<Category>('/categories', data).then((r) => r.data),

  update: (id: string, data: UpdateCategoryDto) =>
    apiClient.patch<Category>(`/categories/${id}`, data).then((r) => r.data),

  remove: (id: string) => apiClient.delete(`/categories/${id}`),
};
