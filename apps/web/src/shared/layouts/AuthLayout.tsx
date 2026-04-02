import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Brand mark */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-shell rounded-2xl mb-5">
            <span className="text-2xl font-black text-brand-accent tracking-tighter select-none">
              HW
            </span>
          </div>
          <h1 className="text-3xl font-black text-brand-dark tracking-tight">
            Hates WH
          </h1>
          <p className="text-brand-dark/50 mt-1.5 text-sm">
            Automatiza tus pedidos en WhatsApp
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
