import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router';
import { IngredientsPage } from '../IngredientsPage';
import { ToastProvider } from '../../../../../shared/components/Toast';
import * as ingredientsApiModule from '../../api/ingredients.api';

vi.mock('../../api/ingredients.api', () => ({
  ingredientsApi: {
    getAll: vi.fn(),
    remove: vi.fn(),
  },
}));

const mockIngredients = [
  {
    id: 'ing-1',
    name: 'Cebolla',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'ing-2',
    name: 'Lechuga',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

function renderWithRouter() {
  return render(
    <MemoryRouter initialEntries={['/catalog/ingredients']}>
      <ToastProvider>
        <Routes>
          <Route path="/catalog/ingredients" element={<IngredientsPage />} />
          <Route
            path="/catalog/ingredients/:id/edit"
            element={<div>Edit Page</div>}
          />
          <Route
            path="/catalog/ingredients/new"
            element={<div>New Page</div>}
          />
        </Routes>
      </ToastProvider>
    </MemoryRouter>,
  );
}

describe('IngredientsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading spinner initially', () => {
    vi.mocked(ingredientsApiModule.ingredientsApi.getAll).mockReturnValue(
      new Promise(() => {}),
    );
    renderWithRouter();

    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders ingredients list after loading', async () => {
    vi.mocked(ingredientsApiModule.ingredientsApi.getAll).mockResolvedValue({
      right: mockIngredients,
    });
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Cebolla')).toBeInTheDocument();
      expect(screen.getByText('Lechuga')).toBeInTheDocument();
    });
  });

  it('shows empty state when no ingredients', async () => {
    vi.mocked(ingredientsApiModule.ingredientsApi.getAll).mockResolvedValue({
      right: [],
    });
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Sin ingredientes aún')).toBeInTheDocument();
    });
  });

  it('shows error alert dialog on fetch failure', async () => {
    vi.mocked(ingredientsApiModule.ingredientsApi.getAll).mockResolvedValue({
      left: {
        message: 'Error al cargar los ingredientes',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    });
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      expect(
        screen.getByText('Error al cargar los ingredientes'),
      ).toBeInTheDocument();
    });
  });

  it('navigates to new ingredient page when FAB is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(ingredientsApiModule.ingredientsApi.getAll).mockResolvedValue({
      right: [],
    });
    renderWithRouter();

    await waitFor(() =>
      expect(screen.getByText('Sin ingredientes aún')).toBeInTheDocument(),
    );

    await user.click(screen.getByLabelText('Nuevo ingrediente'));

    expect(screen.getByText('New Page')).toBeInTheDocument();
  });

  it('navigates to edit page when edit button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(ingredientsApiModule.ingredientsApi.getAll).mockResolvedValue({
      right: mockIngredients,
    });
    renderWithRouter();

    await waitFor(() =>
      expect(screen.getByText('Cebolla')).toBeInTheDocument(),
    );

    await user.click(screen.getByLabelText('Editar Cebolla'));

    expect(screen.getByText('Edit Page')).toBeInTheDocument();
  });

  it('opens confirm dialog when delete button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(ingredientsApiModule.ingredientsApi.getAll).mockResolvedValue({
      right: mockIngredients,
    });
    renderWithRouter();

    await waitFor(() =>
      expect(screen.getByText('Cebolla')).toBeInTheDocument(),
    );

    await user.click(screen.getByLabelText('Eliminar Cebolla'));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText('Eliminar ingrediente')).toBeInTheDocument();
    expect(within(dialog).getByText(/Cebolla/)).toBeInTheDocument();
  });

  it('closes dialog when cancel is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(ingredientsApiModule.ingredientsApi.getAll).mockResolvedValue({
      right: mockIngredients,
    });
    renderWithRouter();

    await waitFor(() =>
      expect(screen.getByText('Cebolla')).toBeInTheDocument(),
    );

    await user.click(screen.getByLabelText('Eliminar Cebolla'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls remove and shows success toast on confirm delete', async () => {
    const user = userEvent.setup();
    vi.mocked(ingredientsApiModule.ingredientsApi.getAll).mockResolvedValue({
      right: mockIngredients,
    });
    vi.mocked(ingredientsApiModule.ingredientsApi.remove).mockResolvedValue({
      right: undefined,
    });
    renderWithRouter();

    await waitFor(() =>
      expect(screen.getByText('Cebolla')).toBeInTheDocument(),
    );

    await user.click(screen.getByLabelText('Eliminar Cebolla'));
    await user.click(screen.getByRole('button', { name: 'Eliminar' }));

    await waitFor(() => {
      expect(ingredientsApiModule.ingredientsApi.remove).toHaveBeenCalledWith(
        'ing-1',
      );
    });

    await waitFor(() => {
      expect(
        screen.getByText('Ingrediente eliminado correctamente'),
      ).toBeInTheDocument();
    });
  });

  it('shows error alert dialog when removal fails', async () => {
    const user = userEvent.setup();
    vi.mocked(ingredientsApiModule.ingredientsApi.getAll).mockResolvedValue({
      right: mockIngredients,
    });
    vi.mocked(ingredientsApiModule.ingredientsApi.remove).mockResolvedValue({
      left: {
        message: 'No se pudo eliminar. El ingrediente puede estar en uso.',
        error: 'Conflict',
        statusCode: 409,
      },
    });
    renderWithRouter();

    await waitFor(() =>
      expect(screen.getByText('Cebolla')).toBeInTheDocument(),
    );

    await user.click(screen.getByLabelText('Eliminar Cebolla'));
    await user.click(screen.getByRole('button', { name: 'Eliminar' }));

    await waitFor(() => {
      expect(
        screen.getByText(
          'No se pudo eliminar. El ingrediente puede estar en uso.',
        ),
      ).toBeInTheDocument();
    });
  });
});
