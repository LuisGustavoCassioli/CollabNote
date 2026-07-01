import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async () => {
      return api('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      navigate('/');
    },
    onError: (error: Error) => {
      setErrorMsg(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    mutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMsg && (
        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400 rounded-lg">
          {errorMsg}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-800 dark:text-white transition-all outline-none"
          placeholder="Seu nome"
          required 
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-mail</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-800 dark:text-white transition-all outline-none"
          placeholder="seu@email.com"
          required 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-800 dark:text-white transition-all outline-none"
          placeholder="••••••••"
          minLength={6}
          required 
        />
      </div>

      <button 
        type="submit" 
        disabled={mutation.isPending}
        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors shadow-sm"
      >
        {mutation.isPending ? 'Criando conta...' : 'Cadastrar'}
      </button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
        Já possui conta? <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">Fazer Login</Link>
      </p>
    </form>
  );
}
