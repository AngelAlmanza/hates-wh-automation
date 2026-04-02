import { AuthLayout } from '../../../shared/layouts/AuthLayout';
import { Card } from '../../../shared/components/Card';
import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
  return (
    <AuthLayout>
      <Card>
        <h2 className="text-xl font-black text-brand-dark mb-6 text-center tracking-tight">
          Iniciar sesión
        </h2>
        <LoginForm />
      </Card>
    </AuthLayout>
  );
}
