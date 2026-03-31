import { useNavigate } from 'react-router';
import { useAuth } from '../../../hooks/use-auth';

interface ModuleCard {
  label: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  color: string;
}

const modules: ModuleCard[] = [
  {
    label: 'Categorías',
    description: 'Gestiona las categorías del menú',
    path: '/catalog/categories',
    icon: <TagIcon />,
    color: 'bg-rust-50 text-brand-primary',
  },
  {
    label: 'Ingredientes',
    description: 'Administra los ingredientes disponibles',
    path: '/catalog/ingredients',
    icon: <LeafIcon />,
    color: 'bg-amber-50 text-amber-600',
  },
];

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-brand-dark">
          Hola, {user?.displayName ?? user?.username}
        </h2>
        <p className="mt-1 text-brand-dark/60 text-sm">
          ¿Qué quieres administrar hoy?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {modules.map((mod) => (
          <button
            key={mod.path}
            onClick={() => navigate(mod.path)}
            className="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-rust-100 shadow-sm text-center active:scale-95 hover:shadow-md hover:border-rust-200 transition-all duration-150"
          >
            <span
              className={`w-14 h-14 rounded-xl flex items-center justify-center ${mod.color}`}
            >
              {mod.icon}
            </span>
            <span className="font-semibold text-brand-dark text-sm leading-tight">
              {mod.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function TagIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}
