import { Router } from 'express';
import { celebrate } from 'celebrate';
import { createUserSchema, loginSchema } from '../validators/users';
import { createUser, login } from '../controllers/users';
import { authMiddleware } from '../middleware/auth';
import cardsRouter from './cards';
import usersRouter from './users';
import routeNotFound from '../middleware/routeNotFound';

const router = Router();

router.post('/signin', celebrate(loginSchema), login);
router.post('/signup', celebrate(createUserSchema), createUser);

router.use(authMiddleware);

router.use('/cards', cardsRouter);
router.use('/users', usersRouter);
router.use('*', routeNotFound);

export default router;