import { useCallback, useEffect, useState } from 'react';
import { isLeft } from '../../../../shared/lib/safe-request';
import type { ApiError } from '../../../../shared/types/api-error';
import { ingredientsApi, type Ingredient } from '../api/ingredients.api';

interface UseIngredientsResult {
  ingredients: Ingredient[];
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export function useIngredients(): UseIngredientsResult {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchIngredients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await ingredientsApi.getAll();
    if (isLeft(result)) {
      setError(result.left);
    } else {
      setIngredients(result.right);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  return { ingredients, isLoading, error, refetch: fetchIngredients };
}
