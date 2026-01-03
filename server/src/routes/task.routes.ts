import { Router } from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from '../controllers/task.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getAllTasks);
router.get('/:id', authenticate, getTaskById);
router.post('/', authenticate, authorize('Admin', 'ProjectManager'), createTask);
router.put('/:id', authenticate, updateTask);
router.patch('/:id/status', authenticate, updateTaskStatus);
router.delete('/:id', authenticate, authorize('Admin', 'ProjectManager'), deleteTask);

export default router;
