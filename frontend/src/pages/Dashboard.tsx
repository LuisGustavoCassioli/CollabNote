import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';

interface Document {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export function Dashboard() {
  const [newDocTitle, setNewDocTitle] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: ['documents'],
    queryFn: async () => {
      const data = await api('/documents');
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (title: string) => {
      return api('/documents', {
        method: 'POST',
        body: JSON.stringify({ title, content: '' }),
      });
    },
    onSuccess: (newDoc) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      navigate(`/editor/${newDoc.id}`);
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;
    createMutation.mutate(newDocTitle);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-8 min-h-[calc(100vh-8rem)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-gray-100 dark:border-zinc-800 pb-6">
        <div>
          <h2 className="text-2xl font-bold dark:text-zinc-100">Meus Documentos</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Olá, {user?.name}. Gerencie seus arquivos.
          </p>
        </div>

        <form onSubmit={handleCreate} className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={newDocTitle}
            onChange={(e) => setNewDocTitle(e.target.value)}
            placeholder="Novo documento..."
            className="flex-1 sm:w-64 px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-800 dark:text-white transition-all outline-none"
            required
          />
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
          >
            {createMutation.isPending ? 'Criando...' : 'Criar'}
          </button>
        </form>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <span className="text-gray-400 dark:text-zinc-500">Carregando documentos...</span>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-lg">
          <p className="text-gray-500 dark:text-zinc-400">Nenhum documento encontrado. Crie o primeiro acima.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => navigate(`/editor/${doc.id}`)}
              className="text-left flex flex-col p-5 rounded-xl border border-gray-200 dark:border-zinc-700 hover:border-blue-500 hover:shadow-md dark:hover:border-blue-500 transition-all bg-white dark:bg-zinc-800/50 group"
            >
              <h3 className="font-semibold text-gray-800 dark:text-zinc-200 truncate w-full group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {doc.title}
              </h3>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-400 dark:text-zinc-500">
                <span>{new Date(doc.updatedAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
