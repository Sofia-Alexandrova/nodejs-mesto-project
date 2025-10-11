import express from 'express';
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from '../controllers/cards';

import { celebrate } from 'celebrate';
import { authMiddleware } from '../middleware/auth';
import { createCardSchema, deleteOrLikeCardSchema } from '../validators/cards';

const router = express.Router();

router.get('/', getCards);
router.post('/', authMiddleware, celebrate(createCardSchema), createCard);
router.delete('/:cardId', authMiddleware, celebrate(deleteOrLikeCardSchema), deleteCard);
router.put('/:cardId/likes', authMiddleware, celebrate(deleteOrLikeCardSchema), likeCard);
router.delete('/:cardId/likes', authMiddleware, celebrate(deleteOrLikeCardSchema), dislikeCard);

export default router;

