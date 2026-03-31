import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { IngredientForm } from '../components/IngredientForm';
import { ingredientsApi, type Ingredient } from '../api/ingredients.api';
import type { IngredientFormData } from '../schemas/ingredient.schema';

export function IngredientFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [ingredient, setIngredient] = useState<Ingredient | null>(null);
  const [isLoading, setIsLoading] = useState(isEditing);

  useEffect(() => {
    if (!id) return;
    ingredientsApi
      .getOne(id)
      .then(setIngredient)
      .catch(() => navigate('/catalog/ingredients', { replace: true }))
      .finally(() => setIsLoading(false));
  }, [id, navigate]);

  const handleSubmit = async (data: IngredientFormData) => {
    if (isEditing && id) {
      await ingredientsApi.update(id, data);
    } else {
      await ingredientsApi.create(data);
    }
    navigate('/catalog/ingredients');
  };

  const defaultValues = ingredient ? { name: ingredient.name } : undefined;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/catalog/ingredients')}
          className="p-2 rounded-lg text-brand-dark/60 hover:text-brand-dark hover:bg-rust-50 transition-colors"
          aria-label="Volver"
        >
          <BackIcon />
        </button>
        <h2 className="text-xl font-bold text-brand-dark">
          {isEditing ? 'Editar ingrediente' : 'Nuevo ingrediente'}
        </h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
        </div>
      ) : (
        <IngredientForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          submitLabel={isEditing ? 'Actualizar' : 'Crear ingrediente'}
        />
      )}
    </div>
  );
}

function BackIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
