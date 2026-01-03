export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'ProjectManager' | 'Developer';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  createdBy: User | string;
  teamMembers: User[];
  status: 'Active' | 'Completed' | 'OnHold';
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  projectId: Project | string;
  assignedTo: User[];
  status: 'ToDo' | 'InProgress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: string;
  createdBy: User | string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  tasksByStatus: {
    total: number;
    todo: number;
    inProgress: number;
    completed: number;
  };
  recentTasks: Task[];
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'Admin' | 'ProjectManager' | 'Developer';
}

export interface CreateProjectData {
  name: string;
  description: string;
  teamMembers?: string[];
  status?: 'Active' | 'Completed' | 'OnHold';
}

export interface CreateTaskData {
  title: string;
  description: string;
  projectId: string;
  assignedTo?: string[];
  status?: 'ToDo' | 'InProgress' | 'Completed';
  priority?: 'Low' | 'Medium' | 'High';
  dueDate?: string;
}
