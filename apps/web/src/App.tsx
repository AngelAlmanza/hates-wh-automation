import { BrowserRouter, useRoutes } from 'react-router';
import { AuthProvider } from './context/auth-context';
import { ToastProvider } from './shared/components/Toast';
import { routes } from './router/routes';

function AppRoutes() {
  return useRoutes(routes);
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
