'use client';

import { useState, useEffect } from 'react';
import { Task, CreateTaskData, UpdateTaskData, TaskStatus } from '@/types';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: CreateTaskData | UpdateTaskData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Task['status']>(TaskStatus.PENDENTE);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = task
      ? { title, description, status } as UpdateTaskData
      : { title, description, status } as CreateTaskData;

    await onSubmit(data);
  };

  const isEditing = !!task;

  return (
    <div className="bg-brand-charcoal rounded-xl shadow-card-lg border border-neutral-600 animate-scale-in">
      <div className="px-6 py-4 border-b border-neutral-600">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-brand rounded-lg flex items-center justify-center shadow-glow-orange">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isEditing ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 4v16m8-8H4"} />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              {isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
            </h2>
            <p className="text-sm text-neutral-300 font-medium">
              {isEditing ? 'Faça as alterações necessárias' : 'Preencha os dados da nova tarefa'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-white mb-2">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Título *
            </span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input"
            placeholder="Digite o título da tarefa"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-white mb-2">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Descrição *
            </span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="input resize-none"
            placeholder="Digite a descrição da tarefa"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-semibold text-white mb-2">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Status
            </span>
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Task['status'])}
            className="input"
          >
            <option value={TaskStatus.PENDENTE}>📋 Pendente</option>
            <option value={TaskStatus.EM_ANDAMENTO}>⚡ Em Andamento</option>
            <option value={TaskStatus.CONCLUIDA}>✅ Concluída</option>
          </select>
        </div>

        <div className="flex gap-3 pt-4 border-t border-neutral-600">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn-primary py-3 px-6 font-semibold shadow-glow-orange disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            <span className="flex items-center justify-center">
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {isEditing ? 'Atualizar Tarefa' : 'Criar Tarefa'}
                </>
              )}
            </span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="flex-1 btn-secondary py-3 px-6 font-semibold"
          >
            <span className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancelar
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}; 