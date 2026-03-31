import { Outlet } from 'react-router';
import { useAuth } from '../../hooks/use-auth';
import { Button } from '../components/Button';

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-brand-cream">
      <header className="bg-white border-b border-rust-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-lg font-bold text-brand-dark">Hates WH</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-brand-dark/70">
              {user?.displayName ?? user?.username}
            </span>
            <Button variant="ghost" size="sm" onClick={logout}>
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
