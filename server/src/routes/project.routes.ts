import { Router } from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/project.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getAllProjects);
router.get('/:id', authenticate, getProjectById);
router.post('/', authenticate, authorize('Admin', 'ProjectManager'), createProject);
router.put('/:id', authenticate, authorize('Admin', 'ProjectManager'), updateProject);
router.delete('/:id', authenticate, authorize('Admin', 'ProjectManager'), deleteProject);

export default router;
