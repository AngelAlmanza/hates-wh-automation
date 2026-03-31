import type { RouteObject } from 'react-router';
import { Navigate } from 'react-router';
import { PublicRoute } from './guards/PublicRoute';
import { ProtectedRoute } from './guards/ProtectedRoute';
import { AppLayout } from '../shared/layouts/AppLayout';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { CategoriesPage } from '../features/catalog/categories/pages/CategoriesPage';
import { CategoryFormPage } from '../features/catalog/categories/pages/CategoryFormPage';
import { IngredientsPage } from '../features/catalog/ingredients/pages/IngredientsPage';
import { IngredientFormPage } from '../features/catalog/ingredients/pages/IngredientFormPage';

export const routes: RouteObject[] = [
  {
    element: <PublicRoute />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/catalog/categories', element: <CategoriesPage /> },
          { path: '/catalog/categories/new', element: <CategoryFormPage /> },
          {
            path: '/catalog/categories/:id/edit',
            element: <CategoryFormPage />,
          },
          { path: '/catalog/ingredients', element: <IngredientsPage /> },
          { path: '/catalog/ingredients/new', element: <IngredientFormPage /> },
          {
            path: '/catalog/ingredients/:id/edit',
            element: <IngredientFormPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
];
