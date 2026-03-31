import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCategories } from '../hooks/use-categories';
import { categoriesApi, type Category } from '../api/categories.api';
import { ConfirmDialog } from '../../../../shared/components/ConfirmDialog';

interface DeleteTarget {
  id: string;
  name: string;
}

export function CategoriesPage() {
  const navigate = useNavigate();
  const { categories, isLoading, error, refetch } = useCategories();

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await categoriesApi.remove(deleteTarget.id);
      setDeleteTarget(null);
      await refetch();
    } catch {
      setDeleteError('No se pudo eliminar. Verifica que no tenga productos.');
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-brand-dark">Categorías</h2>
          <p className="text-sm text-brand-dark/60 mt-0.5">
            {categories.length} categoría{categories.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {deleteError && (
        <div
          className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
          role="alert"
        >
          {deleteError}
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
        </div>
      )}

      {error && !isLoading && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
          role="alert"
        >
          {error}
        </div>
      )}

      {!isLoading && !error && categories.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🏷️</div>
          <p className="text-brand-dark/60 font-medium">Sin categorías aún</p>
          <p className="text-sm text-brand-dark/40 mt-1">
            Toca el botón + para agregar la primera
          </p>
        </div>
      )}

      {!isLoading && categories.length > 0 && (
        <ul className="space-y-3">
          {categories.map((category: Category) => (
            <li
              key={category.id}
              className="bg-white rounded-xl border border-rust-100 shadow-sm overflow-hidden"
            >
              <div className="flex items-center gap-3 p-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-brand-dark truncate">
                    {category.name}
                  </p>
                  {category.description && (
                    <p className="text-sm text-brand-dark/60 truncate mt-0.5">
                      {category.description}
                    </p>
                  )}
                  <p className="text-xs text-brand-dark/40 mt-1">
                    Orden: {category.sortOrder}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() =>
                      navigate(`/catalog/categories/${category.id}/edit`)
                    }
                    className="p-2 rounded-lg text-brand-dark/60 hover:text-brand-primary hover:bg-rust-50 transition-colors"
                    aria-label={`Editar ${category.name}`}
                  >
                    <PencilIcon />
                  </button>
                  <button
                    onClick={() =>
                      setDeleteTarget({ id: category.id, name: category.name })
                    }
                    className="p-2 rounded-lg text-brand-dark/60 hover:text-red-600 hover:bg-red-50 transition-colors"
                    aria-label={`Eliminar ${category.name}`}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* FAB */}
      <button
        onClick={() => navigate('/catalog/categories/new')}
        className="fixed bottom-6 right-6 w-14 h-14 bg-brand-primary text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-rust-700 active:scale-95 transition-all"
        aria-label="Nueva categoría"
      >
        +
      </button>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Eliminar categoría"
        description={
          deleteTarget
            ? `¿Estás seguro de que deseas eliminar "${deleteTarget.name}"? Esta acción no se puede deshacer.`
            : undefined
        }
        confirmLabel="Eliminar"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function PencilIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
