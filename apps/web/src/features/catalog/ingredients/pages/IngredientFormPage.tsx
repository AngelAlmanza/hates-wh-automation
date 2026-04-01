import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ErrorAlertDialog } from '../../../../shared/components/ErrorAlertDialog';
import { useToast } from '../../../../shared/components/Toast';
import { isLeft } from '../../../../shared/lib/safe-request';
import type { ApiError } from '../../../../shared/types/api-error';
import { ingredientsApi, type Ingredient } from '../api/ingredients.api';
import { IngredientForm } from '../components/IngredientForm';
import type { IngredientFormData } from '../schemas/ingredient.schema';

export function IngredientFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const { showToast } = useToast();

  const [ingredient, setIngredient] = useState<Ingredient | null>(null);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [submitError, setSubmitError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (!id) return;
    ingredientsApi.getOne(id).then((result) => {
      if (isLeft(result)) {
        navigate('/catalog/ingredients', { replace: true });
      } else {
        setIngredient(result.right);
      }
      setIsLoading(false);
    });
  }, [id, navigate]);

  const handleSubmit = async (data: IngredientFormData) => {
    const result = isEditing && id
      ? await ingredientsApi.update(id, data)
      : await ingredientsApi.create(data);

    if (isLeft(result)) {
      setSubmitError(result.left);
      throw new Error(result.left.message);
    }

    showToast(isEditing ? 'Ingrediente actualizado' : 'Ingrediente creado');
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

      <ErrorAlertDialog
        open={submitError !== null}
        error={submitError}
        onClose={() => setSubmitError(null)}
      />
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
