import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router';
import { CategoriesPage } from '../CategoriesPage';
import * as categoriesApiModule from '../../api/categories.api';

vi.mock('../../api/categories.api', () => ({
  categoriesApi: {
    getAll: vi.fn(),
    remove: vi.fn(),
  },
}));

const mockCategories = [
  {
    id: 'cat-1',
    name: 'Hamburguesas',
    description: 'Hamburguesas artesanales',
    sortOrder: 0,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'cat-2',
    name: 'Bebidas',
    description: null,
    sortOrder: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

function renderWithRouter() {
  return render(
    <MemoryRouter initialEntries={['/catalog/categories']}>
      <Routes>
        <Route path="/catalog/categories" element={<CategoriesPage />} />
        <Route
          path="/catalog/categories/:id/edit"
          element={<div>Edit Page</div>}
        />
        <Route
          path="/catalog/categories/new"
          element={<div>New Page</div>}
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('CategoriesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading spinner initially', () => {
    vi.mocked(categoriesApiModule.categoriesApi.getAll).mockReturnValue(
      new Promise(() => {}),
    );
    renderWithRouter();

    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders categories list after loading', async () => {
    vi.mocked(categoriesApiModule.categoriesApi.getAll).mockResolvedValue(
      mockCategories,
    );
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Hamburguesas')).toBeInTheDocument();
      expect(screen.getByText('Bebidas')).toBeInTheDocument();
    });
  });

  it('shows empty state when no categories', async () => {
    vi.mocked(categoriesApiModule.categoriesApi.getAll).mockResolvedValue([]);
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Sin categorías aún')).toBeInTheDocument();
    });
  });

  it('shows error state on fetch failure', async () => {
    vi.mocked(categoriesApiModule.categoriesApi.getAll).mockRejectedValue(
      new Error('Network error'),
    );
    renderWithRouter();

    await waitFor(() => {
      expect(
        screen.getByText('Error al cargar las categorías'),
      ).toBeInTheDocument();
    });
  });

  it('navigates to new category page when FAB is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(categoriesApiModule.categoriesApi.getAll).mockResolvedValue([]);
    renderWithRouter();

    await waitFor(() =>
      expect(screen.getByText('Sin categorías aún')).toBeInTheDocument(),
    );

    await user.click(screen.getByLabelText('Nueva categoría'));

    expect(screen.getByText('New Page')).toBeInTheDocument();
  });

  it('navigates to edit page when edit button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(categoriesApiModule.categoriesApi.getAll).mockResolvedValue(
      mockCategories,
    );
    renderWithRouter();

    await waitFor(() =>
      expect(screen.getByText('Hamburguesas')).toBeInTheDocument(),
    );

    await user.click(screen.getByLabelText('Editar Hamburguesas'));

    expect(screen.getByText('Edit Page')).toBeInTheDocument();
  });

  it('opens confirm dialog when delete button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(categoriesApiModule.categoriesApi.getAll).mockResolvedValue(
      mockCategories,
    );
    renderWithRouter();

    await waitFor(() =>
      expect(screen.getByText('Hamburguesas')).toBeInTheDocument(),
    );

    await user.click(screen.getByLabelText('Eliminar Hamburguesas'));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText('Eliminar categoría')).toBeInTheDocument();
    expect(within(dialog).getByText(/Hamburguesas/)).toBeInTheDocument();
  });

  it('closes dialog when cancel is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(categoriesApiModule.categoriesApi.getAll).mockResolvedValue(
      mockCategories,
    );
    renderWithRouter();

    await waitFor(() =>
      expect(screen.getByText('Hamburguesas')).toBeInTheDocument(),
    );

    await user.click(screen.getByLabelText('Eliminar Hamburguesas'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls remove and refetches on confirm delete', async () => {
    const user = userEvent.setup();
    vi.mocked(categoriesApiModule.categoriesApi.getAll).mockResolvedValue(
      mockCategories,
    );
    vi.mocked(categoriesApiModule.categoriesApi.remove).mockResolvedValue(
      undefined as never,
    );
    renderWithRouter();

    await waitFor(() =>
      expect(screen.getByText('Hamburguesas')).toBeInTheDocument(),
    );

    await user.click(screen.getByLabelText('Eliminar Hamburguesas'));
    await user.click(screen.getByRole('button', { name: 'Eliminar' }));

    await waitFor(() => {
      expect(categoriesApiModule.categoriesApi.remove).toHaveBeenCalledWith(
        'cat-1',
      );
    });
  });

  it('shows delete error when removal fails', async () => {
    const user = userEvent.setup();
    vi.mocked(categoriesApiModule.categoriesApi.getAll).mockResolvedValue(
      mockCategories,
    );
    vi.mocked(categoriesApiModule.categoriesApi.remove).mockRejectedValue(
      new Error('Conflict'),
    );
    renderWithRouter();

    await waitFor(() =>
      expect(screen.getByText('Hamburguesas')).toBeInTheDocument(),
    );

    await user.click(screen.getByLabelText('Eliminar Hamburguesas'));
    await user.click(screen.getByRole('button', { name: 'Eliminar' }));

    await waitFor(() => {
      expect(
        screen.getByText('No se pudo eliminar. Verifica que no tenga productos.'),
      ).toBeInTheDocument();
    });
  });
});
