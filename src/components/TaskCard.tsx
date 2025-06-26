'use client';

import { Task, TaskStatus } from '@/types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const getStatusConfig = (status: Task['status']) => {
    switch (status) {
      case TaskStatus.PENDENTE:
        return {
          bgColor: 'bg-status-pending-light dark:bg-status-pending-dark/20',
          textColor: 'text-status-pending-dark dark:text-status-pending',
          borderColor: 'border-status-pending/20 dark:border-status-pending',
          icon: (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          label: 'Pendente'
        };
      case TaskStatus.EM_ANDAMENTO:
        return {
          bgColor: 'bg-status-progress-light dark:bg-status-progress-dark/20',
          textColor: 'text-status-progress-dark dark:text-status-progress',
          borderColor: 'border-status-progress/20 dark:border-status-progress',
          icon: (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ),
          label: 'Em Andamento'
        };
      case TaskStatus.CONCLUIDA:
        return {
          bgColor: 'bg-status-success-light dark:bg-status-success-dark/20',
          textColor: 'text-status-success-dark dark:text-status-success',
          borderColor: 'border-status-success/20 dark:border-status-success',
          icon: (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ),
          label: 'Concluída'
        };
      default:
        return {
          bgColor: 'bg-neutral-100 dark:bg-brand-charcoal',
          textColor: 'text-brand-navy dark:text-brand-light',
          borderColor: 'border-neutral-200 dark:border-brand-slate',
          icon: null,
          label: status
        };
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusConfig = getStatusConfig(task.status);

  return (
    <div className="group card p-4 sm:p-5 lg:p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-3 sm:gap-4">
        <h3 className="text-base sm:text-lg font-semibold text-white flex-1 line-clamp-2 group-hover:text-brand-orange transition-colors duration-200">
          {task.title}
        </h3>
        <div className={`self-start sm:ml-3 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor} border flex-shrink-0`}>
          {statusConfig.icon}
          <span className="whitespace-nowrap">{statusConfig.label}</span>
        </div>
      </div>

      <p className="text-neutral-300 mb-6 line-clamp-3 text-sm leading-relaxed font-medium">
        {task.description}
      </p>

      <div className="space-y-2 mb-6">
        <div className="flex items-center text-xs text-neutral-400 font-medium">
          <svg className="w-3 h-3 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="truncate">Criado: {formatDate(task.createdAt)}</span>
        </div>
        {task.completedAt && (
          <div className="flex items-center text-xs text-status-success font-medium">
            <svg className="w-3 h-3 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="truncate">Concluído: {formatDate(task.completedAt)}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          onClick={() => onEdit(task)}
          className="flex-1 bg-gradient-to-r from-brand-blue to-brand-orange hover:from-brand-orange hover:to-brand-blue text-white py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 shadow-card hover:shadow-card-hover hover:shadow-glow-blue no-print"
        >
          <span className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Editar</span>
          </span>
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="flex-1 bg-gradient-to-r from-status-error to-status-error-dark hover:from-status-error-dark hover:to-status-error text-white py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-status-error focus:ring-offset-2 shadow-card hover:shadow-card-hover hover:shadow-glow-orange no-print"
        >
          <span className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Excluir</span>
          </span>
        </button>
      </div>
    </div>
  );
}; 