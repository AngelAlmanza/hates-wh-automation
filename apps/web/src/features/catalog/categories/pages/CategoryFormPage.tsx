import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { CategoryForm } from '../components/CategoryForm';
import { categoriesApi, type Category } from '../api/categories.api';
import type { CategoryFormData } from '../schemas/category.schema';

export function CategoryFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(isEditing);

  useEffect(() => {
    if (!id) return;
    categoriesApi
      .getOne(id)
      .then(setCategory)
      .catch(() => navigate('/catalog/categories', { replace: true }))
      .finally(() => setIsLoading(false));
  }, [id, navigate]);

  const handleSubmit = async (data: CategoryFormData) => {
    const payload = {
      name: data.name,
      description: data.description || undefined,
      sortOrder: data.sortOrder,
    };

    if (isEditing && id) {
      await categoriesApi.update(id, payload);
    } else {
      await categoriesApi.create(payload);
    }
    navigate('/catalog/categories');
  };

  const defaultValues = category
    ? {
        name: category.name,
        description: category.description ?? '',
        sortOrder: category.sortOrder,
      }
    : undefined;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/catalog/categories')}
          className="p-2 rounded-lg text-brand-dark/60 hover:text-brand-dark hover:bg-rust-50 transition-colors"
          aria-label="Volver"
        >
          <BackIcon />
        </button>
        <h2 className="text-xl font-bold text-brand-dark">
          {isEditing ? 'Editar categoría' : 'Nueva categoría'}
        </h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
        </div>
      ) : (
        <CategoryForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          submitLabel={isEditing ? 'Actualizar' : 'Crear categoría'}
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
