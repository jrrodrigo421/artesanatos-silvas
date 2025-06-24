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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Silva&apos;s Artesanatos - ToDo
              </h1>
              <p className="text-sm text-gray-600">
                Bem-vindo, {user?.name || user?.email}!
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {showForm ? 'Cancelar' : 'Nova Tarefa'}
          </button>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Task['status'] | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos os Status</option>
            <option value={TaskStatus.PENDENTE}>Pendente</option>
            <option value={TaskStatus.EM_ANDAMENTO}>Em Andamento</option>
            <option value={TaskStatus.CONCLUIDA}>Concluída</option>
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            Total: {filteredTasks.length} tarefa(s)
          </div>
        </div>

        {showForm && (
          <div className="mb-8">
            <TaskForm
              task={editingTask || undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
              loading={formLoading}
            />
          </div>
        )}

        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {statusFilter === 'all'
                ? 'Nenhuma tarefa encontrada'
                : `Nenhuma tarefa ${statusFilter === TaskStatus.PENDENTE ? 'pendente' : statusFilter === TaskStatus.EM_ANDAMENTO ? 'em andamento' : 'concluída'} encontrada`
              }
            </div>
            <p className="text-gray-400 mt-2">
              Crie sua primeira tarefa clicando no botão &ldquo;Nova Tarefa&rdquo;
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </div>
  );
} 