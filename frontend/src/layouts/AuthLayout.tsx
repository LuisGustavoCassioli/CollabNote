import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function AuthLayout() {
  const token = useAuthStore((state) => state.token);

  // Guarda de rota: Se logado, expulsa da tela de login e redireciona para o dashboard
  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-800">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-blue-600 dark:text-blue-500">CollabNote</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Acesse sua conta para continuar</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
