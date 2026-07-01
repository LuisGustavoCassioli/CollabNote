import { useAuthStore } from '../store/authStore';

const BASE_URL = 'http://localhost:3333/api';

export const api = async (endpoint: string, options: RequestInit = {}) => {
  const token = useAuthStore.getState().token;
  
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Interceptador: Token inválido ou expirado, derruba o usuário.
    useAuthStore.getState().logout();
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'Erro na comunicação com a API');
  }

  return data;
};
