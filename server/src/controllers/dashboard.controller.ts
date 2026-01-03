import { Response } from 'express';
import Project from '../models/Project.model';
import Task from '../models/Task.model';
import { AuthRequest, DashboardStats } from '../types';

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Get total projects
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: 'Active' });

    // Get total tasks
    const totalTasks = await Task.countDocuments();
    const todoTasks = await Task.countDocuments({ status: 'ToDo' });
    const inProgressTasks = await Task.countDocuments({ status: 'InProgress' });
    const completedTasks = await Task.countDocuments({ status: 'Completed' });

    // Get recent tasks
    const recentTasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('projectId', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    const stats: DashboardStats = {
      totalProjects,
      activeProjects,
      totalTasks,
      tasksByStatus: {
        total: totalTasks,
        todo: todoTasks,
        inProgress: inProgressTasks,
        completed: completedTasks,
      },
      recentTasks,
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
