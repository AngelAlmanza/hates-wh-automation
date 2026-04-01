import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ApiError } from '../types/api-error';

interface ErrorAlertDialogProps {
  open: boolean;
  error: ApiError | null;
  onClose: () => void;
}

export function ErrorAlertDialog({ open, error, onClose }: ErrorAlertDialogProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open || !error) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="error-dialog-title"
      aria-describedby="error-dialog-desc"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Red header strip */}
        <div className="bg-red-50 border-b border-red-100 px-6 pt-6 pb-4 flex items-center gap-3">
          <div className="shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-red-600"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <h2
              id="error-dialog-title"
              className="text-base font-bold text-red-800"
            >
              Ocurrió un error
            </h2>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-3">
          <p id="error-dialog-desc" className="text-sm text-brand-dark leading-relaxed">
            {error.message}
          </p>

          {error.errors && error.errors.length > 0 && (
            <ul className="space-y-1 pl-0">
              {error.errors.map((e, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2"
                >
                  <span className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-red-400" />
                  {e}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full inline-flex items-center justify-center font-semibold rounded-lg px-4 py-2.5 text-base
              bg-brand-dark text-white hover:bg-brand-dark/90 active:bg-brand-dark/80
              transition-colors duration-150"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
