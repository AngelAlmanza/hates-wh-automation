import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router';
import { CategoriesPage } from '../CategoriesPage';
import { ToastProvider } from '../../../../../shared/components/Toast';
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
      <ToastProvider>
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
      </ToastProvider>
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
    vi.mocked(categoriesApiModule.categoriesApi.getAll).mockResolvedValue({
      right: mockCategories,
    });
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Hamburguesas')).toBeInTheDocument();
      expect(screen.getByText('Bebidas')).toBeInTheDocument();
    });
  });

  it('shows empty state when no categories', async () => {
    vi.mocked(categoriesApiModule.categoriesApi.getAll).mockResolvedValue({
      right: [],
    });
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Sin categorías aún')).toBeInTheDocument();
    });
  });

  it('shows error alert dialog on fetch failure', async () => {
    vi.mocked(categoriesApiModule.categoriesApi.getAll).mockResolvedValue({
      left: {
        message: 'Error al cargar las categorías',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    });
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      expect(
        screen.getByText('Error al cargar las categorías'),
      ).toBeInTheDocument();
    });
  });

  it('navigates to new category page when FAB is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(categoriesApiModule.categoriesApi.getAll).mockResolvedValue({
      right: [],
    });
    renderWithRouter();

    await waitFor(() =>
      expect(screen.getByText('Sin categorías aún')).toBeInTheDocument(),
    );

    await user.click(screen.getByLabelText('Nueva categoría'));

    expect(screen.getByText('New Page')).toBeInTheDocument();
  });

  it('navigates to edit page when edit button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(categoriesApiModule.categoriesApi.getAll).mockResolvedValue({
      right: mockCategories,
    });
    renderWithRouter();

    await waitFor(() =>
      expect(screen.getByText('Hamburguesas')).toBeInTheDocument(),
    );

    await user.click(screen.getByLabelText('Editar Hamburguesas'));

    expect(screen.getByText('Edit Page')).toBeInTheDocument();
  });

  it('opens confirm dialog when delete button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(categoriesApiModule.categoriesApi.getAll).mockResolvedValue({
      right: mockCategories,
    });
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
    vi.mocked(categoriesApiModule.categoriesApi.getAll).mockResolvedValue({
      right: mockCategories,
    });
    renderWithRouter();

    await waitFor(() =>
      expect(screen.getByText('Hamburguesas')).toBeInTheDocument(),
    );

    await user.click(screen.getByLabelText('Eliminar Hamburguesas'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls remove and shows success toast on confirm delete', async () => {
    const user = userEvent.setup();
    vi.mocked(categoriesApiModule.categoriesApi.getAll).mockResolvedValue({
      right: mockCategories,
    });
    vi.mocked(categoriesApiModule.categoriesApi.remove).mockResolvedValue({
      right: undefined,
    });
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

    await waitFor(() => {
      expect(
        screen.getByText('Categoría eliminada correctamente'),
      ).toBeInTheDocument();
    });
  });

  it('shows error alert dialog when removal fails', async () => {
    const user = userEvent.setup();
    vi.mocked(categoriesApiModule.categoriesApi.getAll).mockResolvedValue({
      right: mockCategories,
    });
    vi.mocked(categoriesApiModule.categoriesApi.remove).mockResolvedValue({
      left: {
        message: 'No se pudo eliminar. Verifica que no tenga productos.',
        error: 'Conflict',
        statusCode: 409,
      },
    });
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
