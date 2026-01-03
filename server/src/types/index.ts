import { Request } from 'express';
import { IUser } from '../models/User.model';

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'Admin' | 'ProjectManager' | 'Developer';
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  completed: number;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  tasksByStatus: TaskStats;
  recentTasks: any[];
}
