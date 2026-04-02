import { useNavigate } from 'react-router';
import { useAuth } from '../../../hooks/use-auth';

interface ModuleTile {
  label: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  stripClass: string;
  iconBgClass: string;
  iconColorClass: string;
}

const modules: ModuleTile[] = [
  {
    label: 'Categorías',
    description: 'Agrupa los productos del menú',
    path: '/catalog/categories',
    icon: <TagIcon />,
    stripClass: 'bg-stripe-categories',
    iconBgClass: 'bg-rust-50',
    iconColorClass: 'text-brand-primary',
  },
  {
    label: 'Ingredientes',
    description: 'Los ingredientes de cada producto',
    path: '/catalog/ingredients',
    icon: <LeafIcon />,
    stripClass: 'bg-stripe-ingredients',
    iconBgClass: 'bg-[#eef4f1]',
    iconColorClass: 'text-[#3d6b50]',
  },
  {
    label: 'Productos',
    description: 'Los artículos del menú activos',
    path: '/catalog/products',
    icon: <BoxIcon />,
    stripClass: 'bg-stripe-products',
    iconBgClass: 'bg-amber-50',
    iconColorClass: 'text-brand-accent',
  },
];

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-medium text-brand-dark/50 mb-0.5">Hola,</p>
        <h2 className="text-3xl font-black text-brand-dark tracking-tight leading-none">
          {user?.displayName ?? user?.username}
        </h2>
      </div>

      <p className="text-xs font-bold uppercase tracking-widest text-brand-dark/40 mb-3">
        Catálogo
      </p>

      <div className="space-y-2.5">
        {modules.map((mod) => (
          <button
            key={mod.path}
            onClick={() => navigate(mod.path)}
            className="w-full bg-white rounded-xl overflow-hidden flex border border-rust-100/70 active:scale-[0.98] transition-transform duration-100 text-left"
          >
            <div className={`w-1.5 shrink-0 ${mod.stripClass}`} />
            <div className="flex-1 flex items-center gap-4 px-4 py-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${mod.iconBgClass} ${mod.iconColorClass}`}>
                {mod.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-brand-dark text-base leading-tight">
                  {mod.label}
                </p>
                <p className="text-sm text-brand-dark/50 mt-0.5">
                  {mod.description}
                </p>
              </div>
              <ChevronRightIcon />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function TagIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-dark/30 shrink-0">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
