import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getCurrentUser,
} from '../controllers/users';

import { celebrate } from 'celebrate';
import { getUserByIdSchema, updateUserSchema, updateAvatarSchema } from '../validators/users';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', celebrate(getUserByIdSchema), getUserById);
router.patch('/me', authMiddleware, celebrate(updateUserSchema), updateUserProfile);
router.patch('/me/avatar', authMiddleware, celebrate(updateAvatarSchema), updateUserAvatar);

export default router;



