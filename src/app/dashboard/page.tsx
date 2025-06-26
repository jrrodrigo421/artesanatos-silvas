'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Task, CreateTaskData, UpdateTaskData, TaskStatus } from '@/types';
import { tasks as taskApi } from '@/lib/api';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import { Loading } from '@/components/ui/loading';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<Task['status'] | 'all'>('all');
  const [error, setError] = useState('');

  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const filterTasks = useCallback(() => {
    if (statusFilter === 'all') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(task => task.status === statusFilter));
    }
  }, [tasks, statusFilter]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchTasks();
  }, [isAuthenticated, router]);

  useEffect(() => {
    filterTasks();
  }, [filterTasks]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const tasksData = await taskApi.getAll();
      setTasks(tasksData);
    } catch (error) {
      setError('Erro ao carregar tarefas');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (data: CreateTaskData) => {
    try {
      setFormLoading(true);
      const newTask = await taskApi.create(data);
      setTasks([newTask, ...tasks]);
      setShowForm(false);
    } catch (error) {
      setError('Erro ao criar tarefa');
      console.error('Error creating task:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateTask = async (data: UpdateTaskData) => {
    if (!editingTask) return;

    try {
      setFormLoading(true);
      const updatedTask = await taskApi.update(editingTask.id, data);
      setTasks(tasks.map(task =>
        task.id === editingTask.id ? updatedTask : task
      ));
      setEditingTask(null);
      setShowForm(false);
    } catch (error) {
      setError('Erro ao atualizar tarefa');
      console.error('Error updating task:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormSubmit = async (data: CreateTaskData | UpdateTaskData) => {
    if (editingTask) {
      await handleUpdateTask(data as UpdateTaskData);
    } else {
      await handleCreateTask(data as CreateTaskData);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;

    try {
      await taskApi.delete(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      setError('Erro ao excluir tarefa');
      console.error('Error deleting task:', error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const taskStats = {
    total: tasks.length,
    pendente: tasks.filter(t => t.status === TaskStatus.PENDENTE).length,
    emAndamento: tasks.filter(t => t.status === TaskStatus.EM_ANDAMENTO).length,
    concluida: tasks.filter(t => t.status === TaskStatus.CONCLUIDA).length,
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <header className="sticky top-0 z-50 glass-effect shadow-card">
        <div className="container-responsive">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4 sm:gap-0 sm:h-16">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-brand rounded-xl flex items-center justify-center shadow-glow-orange">
                  <span className="text-white font-bold text-sm sm:text-base">S</span>
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-white">
                    Silva&apos;s Artesanatos
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-300 font-medium">
                    Bem-vindo, {user?.name || user?.email?.split('@')[0]}!
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="self-end sm:self-center px-3 py-2 sm:px-4 text-sm font-semibold text-status-error hover:text-white hover:bg-status-error rounded-lg transition-all duration-200 no-print border border-status-error hover:border-status-error"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="container-responsive py-6 sm:py-8">
        {error && (
          <div className="mb-6 p-4 bg-status-error-light border border-status-error text-status-error-dark rounded-xl animate-fade-in">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm sm:text-base font-medium">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="card p-3 sm:p-4 lg:p-6 hover:shadow-card-hover transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-neutral-400 truncate">Total</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{taskStats.total}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-brand-blue to-brand-orange rounded-lg flex items-center justify-center group-hover:shadow-glow-blue transition-all duration-200">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card p-3 sm:p-4 lg:p-6 hover:shadow-card-hover transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-neutral-400 truncate">Pendente</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-status-pending">{taskStats.pendente}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-status-pending to-status-pending-dark rounded-lg flex items-center justify-center group-hover:shadow-glow-orange transition-all duration-200">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card p-3 sm:p-4 lg:p-6 hover:shadow-card-hover transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-neutral-400 truncate">Em Andamento</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-status-progress">{taskStats.emAndamento}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-status-progress to-status-progress-dark rounded-lg flex items-center justify-center group-hover:shadow-glow-blue transition-all duration-200">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card p-3 sm:p-4 lg:p-6 hover:shadow-card-hover transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-neutral-400 truncate">Concluída</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-status-success">{taskStats.concluida}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-status-success to-status-success-dark rounded-lg flex items-center justify-center group-hover:shadow-glow-green transition-all duration-200">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-sm sm:text-base font-semibold text-white">Filtrar:</span>
            {[
              { value: 'all', label: 'Todas', count: taskStats.total },
              { value: TaskStatus.PENDENTE, label: 'Pendente', count: taskStats.pendente },
              { value: TaskStatus.EM_ANDAMENTO, label: 'Em Andamento', count: taskStats.emAndamento },
              { value: TaskStatus.CONCLUIDA, label: 'Concluída', count: taskStats.concluida },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value as Task['status'] | 'all')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${statusFilter === filter.value
                  ? 'bg-gradient-brand text-white shadow-glow-orange border border-brand-orange/40'
                  : 'bg-brand-charcoal text-white hover:bg-brand-orange border border-neutral-600 hover:border-brand-orange'
                  }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto btn-primary text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 shadow-glow-orange hover:shadow-glow-orange no-print"
          >
            <span className="flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nova Tarefa
            </span>
          </button>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-brand-subtle rounded-full mb-4 sm:mb-6">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
              {statusFilter === 'all' ? 'Nenhuma tarefa encontrada' : `Nenhuma tarefa ${statusFilter.toLowerCase()}`}
            </h3>
            <p className="text-sm sm:text-base text-neutral-300 mb-6 sm:mb-8 font-medium">
              {statusFilter === 'all'
                ? 'Comece criando sua primeira tarefa clicando no botão "Nova Tarefa" acima.'
                : 'Altere o filtro ou crie uma nova tarefa para começar.'
              }
            </p>
            {statusFilter === 'all' && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 shadow-glow-orange no-print font-semibold"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Criar Primeira Tarefa
                </span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid-responsive animate-fade-in-up">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-brand-charcoal rounded-2xl shadow-card-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <TaskForm
              task={editingTask || undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
              loading={formLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
} 