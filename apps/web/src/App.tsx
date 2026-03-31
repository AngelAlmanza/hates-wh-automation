import { BrowserRouter, useRoutes } from 'react-router';
import { AuthProvider } from './context/auth-context';
import { routes } from './router/routes';

function AppRoutes() {
  return useRoutes(routes);
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
