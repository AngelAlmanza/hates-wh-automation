import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-dark tracking-tight">
            Hates WH
          </h1>
          <p className="text-brand-dark/60 mt-1 text-sm">
            Automatiza tus pedidos en WhatsApp
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
