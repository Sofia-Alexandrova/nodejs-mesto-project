import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import { BadRequestError } from '../errors/badRequest';
import NotFoundError from '../errors/notFound';
import ConflictError from '../errors/conflictError';

const JWT_SECRET = process.env.JWT_SECRET ?? 'some-secret-key';
const JWT_EXPIRES_IN = '7d';

type ReqWithUser = Request & { user?: { _id: string } | null };

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
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return next(new BadRequestError('Некорректный id пользователя'));
    }
    const user = await User.findById(userId);
    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }

    const { password, ...userData } = user.toObject();
    return res.status(200).json({ data: userData });
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return next(new BadRequestError('Email и пароль обязательны для создания пользователя.'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const created = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });

    const { password: _, ...userToReturn } = created.toObject();

    return res.status(201).json({ data: userToReturn });
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
    }
    if (err.code === 11000) {
      return next(new ConflictError('Пользователь с таким email уже существует.'));
    }
    next(err);
  }
};

export const updateUserProfile = async (req: ReqWithUser, res: Response, next: NextFunction) => {
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

    const { password, ...userData } = updated.toObject();
    return res.status(200).json({ data: userData });
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Некорректные данные при обновлении профиля.'));
    }
    next(err);
  }
};

export const updateUserAvatar = async (req: ReqWithUser, res: Response, next: NextFunction) => {
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

    const { password, ...userData } = updated.toObject();
    return res.status(200).json({ data: userData });
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Некорректные данные при обновлении аватара.'));
    }
    next(err);
  }
};

export const getCurrentUser = async (req: ReqWithUser, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return next(new BadRequestError('Неавторизованный запрос'));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }

    const { password, ...userData } = user.toObject();
    return res.status(200).json({ data: userData });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new BadRequestError('Email и пароль обязательны для входа.'));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      const authError = new BadRequestError('Неправильные почта или пароль');
      (authError as any).statusCode = 401;
      return next(authError);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const authError = new BadRequestError('Неправильные почта или пароль');
      (authError as any).statusCode = 401;
      return next(authError);
    }

    const token = jwt.sign(
      { _id: user._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    return res.status(200).json({ message: 'Авторизация успешна' });
  } catch (err) {
    next(err);
  }
};
