import { useAuth } from '../../../hooks/use-auth';

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h2 className="text-2xl font-bold text-brand-dark">
        Bienvenido, {user?.displayName ?? user?.username}
      </h2>
      <p className="mt-2 text-brand-dark/60">
        Panel de administración de pedidos.
      </p>
    </div>
  );
}
