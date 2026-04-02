import { Outlet, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/use-auth';

const tabs = [
  { path: '/dashboard', label: 'Inicio', exact: true, icon: <HomeIcon /> },
  { path: '/catalog/categories', label: 'Categorías', exact: false, icon: <TagIcon /> },
  { path: '/catalog/ingredients', label: 'Ingredientes', exact: false, icon: <LeafIcon /> },
  { path: '/catalog/products', label: 'Productos', exact: false, icon: <BoxIcon /> },
];

export function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const displayName = user?.displayName ?? user?.username ?? '';

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col">
      {/* Header */}
      <header className="bg-shell sticky top-0 z-40 border-b border-white/8">
        <div className="px-4 h-14 flex items-center justify-between max-w-2xl mx-auto w-full">
          <span className="text-xl font-black tracking-tight text-brand-cream">
            Hates WH
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center shrink-0">
              <span className="text-sm font-black text-shell leading-none select-none">
                {displayName[0]?.toUpperCase() ?? '?'}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg text-brand-cream/50 hover:text-brand-cream hover:bg-white/10 transition-colors"
              aria-label="Cerrar sesión"
            >
              <LogoutIcon />
            </button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 px-4 py-6 pb-28 max-w-2xl mx-auto w-full">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 bg-shell border-t border-white/8 z-40"
        aria-label="Navegación principal"
      >
        <div className="flex max-w-2xl mx-auto">
          {tabs.map((tab) => {
            const active = tab.exact
              ? location.pathname === tab.path
              : location.pathname.startsWith(tab.path);
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`
                  flex-1 flex flex-col items-center gap-1 py-2.5
                  transition-colors duration-150
                  ${active
                    ? 'text-brand-accent'
                    : 'text-brand-cream/35 hover:text-brand-cream/60'
                  }
                `}
                aria-current={active ? 'page' : undefined}
              >
                {tab.icon}
                <span className="text-[9px] font-bold uppercase tracking-wide leading-none">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
