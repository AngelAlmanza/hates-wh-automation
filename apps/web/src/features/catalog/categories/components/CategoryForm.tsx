import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema, type CategoryFormData } from '../schemas/category.schema';
import { Input } from '../../../../shared/components/Input';
import { Button } from '../../../../shared/components/Button';
import type { Category } from '../api/categories.api';

interface CategoryFormProps {
  defaultValues?: Partial<CategoryFormData>;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  submitLabel?: string;
  category?: Category;
}

export function CategoryForm({
  defaultValues,
  onSubmit,
  submitLabel = 'Guardar',
}: CategoryFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      description: defaultValues?.description ?? '',
      sortOrder: defaultValues?.sortOrder ?? 0,
    },
  });

  const handleFormSubmit = async (data: CategoryFormData) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Ocurrió un error inesperado';
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-5"
      noValidate
    >
      {serverError && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
          role="alert"
        >
          {serverError}
        </div>
      )}

      <Input
        label="Nombre"
        placeholder="Ej. Hamburguesas"
        error={errors.name?.message}
        {...register('name')}
      />

      <div className="w-full">
        <label
          htmlFor="description"
          className="block text-base font-semibold text-brand-dark mb-2"
        >
          Descripción <span className="text-brand-dark/40 font-normal text-sm">(opcional)</span>
        </label>
        <textarea
          id="description"
          rows={3}
          placeholder="Breve descripción de la categoría"
          className={`
            w-full px-4 py-3 rounded-xl text-base
            bg-rust-50 border border-rust-100 text-brand-dark
            placeholder:text-brand-dark/35
            transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent
            resize-none
            ${errors.description ? 'border-red-400 focus:ring-red-400' : ''}
          `}
          aria-invalid={!!errors.description}
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1.5 text-sm text-red-600 font-medium" role="alert">
            {errors.description.message}
          </p>
        )}
      </div>

      <Input
        label="Orden"
        type="number"
        min={0}
        placeholder="0"
        error={errors.sortOrder?.message}
        {...register('sortOrder', { valueAsNumber: true })}
      />

      <Button
        type="submit"
        loading={isSubmitting}
        className="w-full"
        size="lg"
      >
        {submitLabel}
      </Button>
    </form>
  );
}
