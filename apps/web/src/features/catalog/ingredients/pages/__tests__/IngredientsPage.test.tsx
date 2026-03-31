import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router';
import { IngredientsPage } from '../IngredientsPage';
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
    vi.mocked(ingredientsApiModule.ingredientsApi.getAll).mockResolvedValue(
      mockIngredients,
    );
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Cebolla')).toBeInTheDocument();
      expect(screen.getByText('Lechuga')).toBeInTheDocument();
    });
  });

  it('shows empty state when no ingredients', async () => {
    vi.mocked(ingredientsApiModule.ingredientsApi.getAll).mockResolvedValue([]);
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Sin ingredientes aún')).toBeInTheDocument();
    });
  });

  it('shows error state on fetch failure', async () => {
    vi.mocked(ingredientsApiModule.ingredientsApi.getAll).mockRejectedValue(
      new Error('Network error'),
    );
    renderWithRouter();

    await waitFor(() => {
      expect(
        screen.getByText('Error al cargar los ingredientes'),
      ).toBeInTheDocument();
    });
  });

  it('navigates to new ingredient page when FAB is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(ingredientsApiModule.ingredientsApi.getAll).mockResolvedValue([]);
    renderWithRouter();

    await waitFor(() =>
      expect(screen.getByText('Sin ingredientes aún')).toBeInTheDocument(),
    );

    await user.click(screen.getByLabelText('Nuevo ingrediente'));

    expect(screen.getByText('New Page')).toBeInTheDocument();
  });

  it('navigates to edit page when edit button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(ingredientsApiModule.ingredientsApi.getAll).mockResolvedValue(
      mockIngredients,
    );
    renderWithRouter();

    await waitFor(() =>
      expect(screen.getByText('Cebolla')).toBeInTheDocument(),
    );

    await user.click(screen.getByLabelText('Editar Cebolla'));

    expect(screen.getByText('Edit Page')).toBeInTheDocument();
  });

  it('opens confirm dialog when delete button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(ingredientsApiModule.ingredientsApi.getAll).mockResolvedValue(
      mockIngredients,
    );
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
    vi.mocked(ingredientsApiModule.ingredientsApi.getAll).mockResolvedValue(
      mockIngredients,
    );
    renderWithRouter();

    await waitFor(() =>
      expect(screen.getByText('Cebolla')).toBeInTheDocument(),
    );

    await user.click(screen.getByLabelText('Eliminar Cebolla'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls remove and refetches on confirm delete', async () => {
    const user = userEvent.setup();
    vi.mocked(ingredientsApiModule.ingredientsApi.getAll).mockResolvedValue(
      mockIngredients,
    );
    vi.mocked(ingredientsApiModule.ingredientsApi.remove).mockResolvedValue(
      undefined as never,
    );
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
  });

  it('shows delete error when removal fails', async () => {
    const user = userEvent.setup();
    vi.mocked(ingredientsApiModule.ingredientsApi.getAll).mockResolvedValue(
      mockIngredients,
    );
    vi.mocked(ingredientsApiModule.ingredientsApi.remove).mockRejectedValue(
      new Error('Conflict'),
    );
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
