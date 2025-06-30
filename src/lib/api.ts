import axios from 'axios';
import { LoginCredentials, RegisterCredentials, Task, User, CreateTaskData, UpdateTaskData, AuthResponse, ApiResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Erro no login');
    }
    return response.data.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', credentials);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Erro no registro');
    }
    return response.data.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Erro ao obter usuário');
    }
    return response.data.data;
  },
};

export const tasks = {
  getAll: async (status?: string): Promise<Task[]> => {
    const params = status ? { status } : {};
    const response = await api.get<ApiResponse<Task[]>>('/tasks', { params });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Erro ao buscar tarefas');
    }
    return response.data.data;
  },

  getById: async (id: string): Promise<Task> => {
    const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Erro ao buscar tarefa');
    }
    return response.data.data;
  },

  create: async (taskData: CreateTaskData): Promise<Task> => {
    const response = await api.post<ApiResponse<Task>>('/tasks', taskData);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Erro ao criar tarefa');
    }
    return response.data.data;
  },

  update: async (id: string, taskData: UpdateTaskData): Promise<Task> => {
    const response = await api.put<ApiResponse<Task>>(`/tasks/${id}`, taskData);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Erro ao atualizar tarefa');
    }
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    const response = await api.delete<ApiResponse<void>>(`/tasks/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Erro ao deletar tarefa');
    }
  },
};

export default api; 