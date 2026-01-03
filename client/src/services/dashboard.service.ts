import api from './api';
import type { DashboardStats } from '../types';

export const dashboardService = {
  getStats: async () => {
    const response = await api.get<{ success: boolean; stats: DashboardStats }>('/dashboard/stats');
    return response.data;
  },
};
