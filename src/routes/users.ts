import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getCurrentUser,
} from '../controllers/users';

import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:userId', getUserById);

router.get('/me', authMiddleware, getCurrentUser);

router.patch('/me', authMiddleware, updateUserProfile);
router.patch('/me/avatar', authMiddleware, updateUserAvatar);

export default router;



