import { AuthLayout } from '../../../shared/layouts/AuthLayout';
import { Card } from '../../../shared/components/Card';
import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
  return (
    <AuthLayout>
      <Card>
        <h2 className="text-xl font-semibold text-brand-dark mb-6 text-center">
          Iniciar sesión
        </h2>
        <LoginForm />
      </Card>
    </AuthLayout>
  );
}
