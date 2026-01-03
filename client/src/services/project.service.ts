import api from './api';
import type { CreateProjectData, Project } from '../types';

export const projectService = {
  getAll: async () => {
    const response = await api.get<{ success: boolean; projects: Project[] }>('/projects');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<{ success: boolean; project: Project }>(`/projects/${id}`);
    return response.data;
  },

  create: async (data: CreateProjectData) => {
    const response = await api.post<{ success: boolean; project: Project }>('/projects', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateProjectData>) => {
    const response = await api.put<{ success: boolean; project: Project }>(`/projects/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};
