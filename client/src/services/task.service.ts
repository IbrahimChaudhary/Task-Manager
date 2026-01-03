import api from './api';
import type { CreateTaskData, Task } from '../types';

export const taskService = {
  getAll: async (projectId?: string, status?: string) => {
    const params = new URLSearchParams();
    if (projectId) params.append('projectId', projectId);
    if (status) params.append('status', status);

    const response = await api.get<{ success: boolean; tasks: Task[] }>(`/tasks?${params}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<{ success: boolean; task: Task }>(`/tasks/${id}`);
    return response.data;
  },

  create: async (data: CreateTaskData) => {
    const response = await api.post<{ success: boolean; task: Task }>('/tasks', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateTaskData>) => {
    const response = await api.put<{ success: boolean; task: Task }>(`/tasks/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: string, status: 'ToDo' | 'InProgress' | 'Completed') => {
    const response = await api.patch<{ success: boolean; task: Task }>(`/tasks/${id}/status`, { status });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};
