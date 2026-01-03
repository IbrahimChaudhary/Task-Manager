import { Response } from 'express';
import Task from '../models/Task.model';
import { AuthRequest } from '../types';

export const getAllTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { projectId, status } = req.query;
    const filter: any = {};

    if (projectId) filter.projectId = projectId;
    if (status) filter.status = status;

    const tasks = await Task.find(filter)
      .populate('projectId', 'name')
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tasks,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTaskById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('projectId', 'name')
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email');

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.json({
      success: true,
      task,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, projectId, assignedTo, status, priority, dueDate } = req.body;

    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const task = await Task.create({
      title,
      description,
      projectId,
      assignedTo: assignedTo || [],
      status: status || 'ToDo',
      priority: priority || 'Medium',
      dueDate,
      createdBy: req.user._id,
    });

    const populatedTask = await Task.findById(task._id)
      .populate('projectId', 'name')
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: populatedTask,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, assignedTo, status, priority, dueDate } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, assignedTo, status, priority, dueDate },
      { new: true, runValidators: true }
    )
      .populate('projectId', 'name')
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email');

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      task,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('projectId', 'name')
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email');

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Task status updated successfully',
      task,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
