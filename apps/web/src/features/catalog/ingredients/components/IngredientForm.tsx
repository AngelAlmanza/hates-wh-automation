import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ingredientSchema, type IngredientFormData } from '../schemas/ingredient.schema';
import { Input } from '../../../../shared/components/Input';
import { Button } from '../../../../shared/components/Button';

interface IngredientFormProps {
  defaultValues?: Partial<IngredientFormData>;
  onSubmit: (data: IngredientFormData) => Promise<void>;
  submitLabel?: string;
}

export function IngredientForm({
  defaultValues,
  onSubmit,
  submitLabel = 'Guardar',
}: IngredientFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IngredientFormData>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
    },
  });

  const handleFormSubmit = async (data: IngredientFormData) => {
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
        placeholder="Ej. Cebolla"
        error={errors.name?.message}
        {...register('name')}
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
