import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { connectSocket, disconnectSocket, getSocket } from '../services/socket';
import { useAuthStore } from '../store/authStore';

export function Editor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  
  const [content, setContent] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  // Usar uma ref para o conteúdo atual para evitar closures presas (stale closures) no socket listener
  const contentRef = useRef(content);
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  const { data: document, isLoading, isError } = useQuery({
    queryKey: ['document', id],
    queryFn: async () => {
      const data = await api(`/documents/${id}`);
      return data;
    },
    staleTime: 0, 
  });

  const saveMutation = useMutation({
    mutationFn: async (newContent: string) => {
      return api(`/documents/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ title: document?.title, content: newContent }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    }
  });

  useEffect(() => {
    if (document && document.content !== undefined && !contentRef.current) {
      setContent(document.content);
    }
  }, [document]);

  useEffect(() => {
    if (!token || !id) return;

    const socket = connectSocket(token);

    const onConnect = () => {
      setIsConnected(true);
      socket.emit('join_document', id);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onReceiveChanges = (changes: string) => {
      setContent(changes);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('receive_changes', onReceiveChanges);

    // Se o socket já estiver conectado no momento de montar, chama o onConnect manualmente
    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.emit('leave_document', id);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('receive_changes', onReceiveChanges);
      // disconnectSocket(); // removido para não conflitar com React Strict Mode double-mount
    };
  }, [id, token]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit('send_changes', { documentId: id, changes: newContent });
    }
  };

  const handleSave = () => {
    saveMutation.mutate(content);
  };

  if (isLoading) return <div className="p-8 text-gray-500 text-center">Carregando editor...</div>;
  if (isError) return <div className="p-8 text-red-500 text-center">Erro ao carregar documento. Talvez ele não exista ou você não tenha acesso.</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-zinc-800">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
          >
            ← Voltar
          </button>
          <h2 className="text-xl font-bold dark:text-zinc-100 truncate max-w-[200px] sm:max-w-xs">{document?.title}</h2>
          
          {isConnected ? (
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden sm:inline">Conectado</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span className="hidden sm:inline">Desconectado</span>
            </span>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {saveMutation.isPending ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      <div className="flex-1 p-0 relative">
        <textarea
          value={content}
          onChange={handleChange}
          placeholder="Comece a digitar aqui..."
          className="absolute inset-0 w-full h-full p-6 lg:p-12 resize-none outline-none border-none bg-transparent text-gray-800 dark:text-zinc-200 font-mono text-base leading-relaxed focus:ring-0"
        />
      </div>
    </div>
  );
}
