import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import User from '../models/user';
import { BadRequestError } from '../errors/badRequest';
import NotFoundError from '../errors/notFound';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.status(200).json({ data: users });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(new BadRequestError('Некорректный id пользователя'));
    }
    const user = await User.findById(userId);
    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }
    return res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about, avatar } = req.body;
    const created = await User.create({ name, about, avatar });
    return res.status(201).json({ data: created });
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
    }
    next(err);
  }
};

export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about } = req.body;
    const userId = req.user?._id;
    if (!userId) {
      return next(new BadRequestError('Неавторизованный запрос'));
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!updated) {
      return next(new NotFoundError('Пользователь не найден'));
    }
    return res.status(200).json({ data: updated });
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Некорректные данные при обновлении профиля.'));
    }
    next(err);
  }
};

export const updateUserAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;
    const userId = req.user?._id;
    if (!userId) {
      return next(new BadRequestError('Неавторизованный запрос'));
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!updated) {
      return next(new NotFoundError('Пользователь не найден'));
    }
    return res.status(200).json({ data: updated });
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Некорректные данные при обновлении аватара.'));
    }
    next(err);
  }
};
