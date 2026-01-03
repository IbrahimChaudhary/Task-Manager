import api from './api';
import type { User } from '../types';

export const userService = {
  getAll: async () => {
    const response = await api.get<{ success: boolean; users: User[] }>('/users');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<{ success: boolean; user: User }>(`/users/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<User>) => {
    const response = await api.put<{ success: boolean; user: User }>(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
