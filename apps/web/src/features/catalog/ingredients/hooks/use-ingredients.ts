import { useState, useEffect, useCallback } from 'react';
import { ingredientsApi, type Ingredient } from '../api/ingredients.api';

interface UseIngredientsResult {
  ingredients: Ingredient[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useIngredients(): UseIngredientsResult {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIngredients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ingredientsApi.getAll();
      setIngredients(data);
    } catch {
      setError('Error al cargar los ingredientes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  return { ingredients, isLoading, error, refetch: fetchIngredients };
}
