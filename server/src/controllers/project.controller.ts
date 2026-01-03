import { Response } from 'express';
import Project from '../models/Project.model';
import { AuthRequest } from '../types';

export const getAllProjects = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projects = await Project.find()
      .populate('createdBy', 'name email')
      .populate('teamMembers', 'name email role');

    res.json({
      success: true,
      projects,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('teamMembers', 'name email role');

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    res.json({
      success: true,
      project,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, teamMembers, status } = req.body;

    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      teamMembers: teamMembers || [],
      status: status || 'Active',
    });

    const populatedProject = await Project.findById(project._id)
      .populate('createdBy', 'name email')
      .populate('teamMembers', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project: populatedProject,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, teamMembers, status } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, teamMembers, status },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email')
      .populate('teamMembers', 'name email role');

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Project updated successfully',
      project,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
