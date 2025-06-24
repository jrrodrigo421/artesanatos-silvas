'use client';

import { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'em_andamento':
        return 'bg-blue-100 text-blue-800';
      case 'concluida':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'em_andamento':
        return 'Em Andamento';
      case 'concluida':
        return 'Concluída';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex-1">{task.title}</h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
        >
          {getStatusText(task.status)}
        </span>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-3">{task.description}</p>

      <div className="text-sm text-gray-500 mb-4">
        <p>Criado em: {formatDate(task.createdAt)}</p>
        {task.completedAt && (
          <p>Concluído em: {formatDate(task.completedAt)}</p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(task)}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Editar
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Excluir
        </button>
      </div>
    </div>
  );
}; 