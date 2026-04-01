import { useState, useEffect, useCallback } from 'react';
import { categoriesApi, type Category } from '../api/categories.api';
import { isLeft } from '../../../../shared/lib/safe-request';
import type { ApiError } from '../../../../shared/types/api-error';

interface UseCategoriesResult {
  categories: Category[];
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await categoriesApi.getAll();
    if (isLeft(result)) {
      setError(result.left);
    } else {
      setCategories(result.right);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, isLoading, error, refetch: fetchCategories };
}
