export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pendente' | 'em_andamento' | 'concluida';
  createdAt: string;
  completedAt?: string;
  userId: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  status?: Task['status'];
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: Task['status'];
} 