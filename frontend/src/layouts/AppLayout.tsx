import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function AppLayout() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // Guarda de rota: Se deslogado, manda de volta para o login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col">
      <header className="h-16 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between px-6">
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-500">CollabNote</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {user?.name}
          </span>
          <button 
            onClick={logout}
            className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
          >
            Sair
          </button>
        </div>
      </header>
      
      <main className="flex-1 p-6 overflow-hidden flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
