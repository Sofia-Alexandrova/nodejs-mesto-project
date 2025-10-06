import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';
import { BadRequestError } from '../errors/badRequest';
import NotFoundError from '../errors/notFound';
import { ForbiddenError } from '../errors/badRequest'; 

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({}).populate('owner likes');
    return res.status(200).json({ data: cards });
  } catch (err) {
    next(err);
  }
};

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const owner = req.user?._id;
    if (!owner) {
      return next(new BadRequestError('Неавторизованный запрос'));
    }

    const card = await Card.create({ name, link, owner });
    const populated = await Card.findById(card._id).populate('owner likes');
    return res.status(201).json({ data: populated });
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
    }
    next(err);
  }
};

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return next(new BadRequestError('Некорректный id карточки'));
    }

    const card = await Card.findById(cardId);
    if (!card) {
      return next(new NotFoundError('Карточка не найдена'));
    }

    if (card.owner.toString() !== req.user?._id) {
      return next(new ForbiddenError('Нет прав на удаление карточки'));
    }

    await card.deleteOne();
    return res.status(200).json({ data: { message: 'Карточка удалена' } });
  } catch (err) {
    next(err);
  }
};

export const likeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return next(new BadRequestError('Некорректный id карточки'));
    }

    const userId = req.user?._id;
    if (!userId) {
      return next(new BadRequestError('Неавторизованный запрос'));
    }

    const updated = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    ).populate('owner likes');

    if (!updated) {
      return next(new NotFoundError('Карточка не найдена'));
    }
    return res.status(200).json({ data: updated });
  } catch (err) {
    next(err);
  }
};

export const dislikeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return next(new BadRequestError('Некорректный id карточки'));
    }

    const userId = req.user?._id;
    if (!userId) {
      return next(new BadRequestError('Неавторизованный запрос'));
    }

    const updated = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    ).populate('owner likes');

    if (!updated) {
      return next(new NotFoundError('Карточка не найдена'));
    }
    return res.status(200).json({ data: updated });
  } catch (err) {
    next(err);
  }
};
