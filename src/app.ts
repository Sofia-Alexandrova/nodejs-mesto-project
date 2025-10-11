import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { login, createUser } from './controllers/users';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import errorHandler from './middleware/errorHandler'; 
import { authMiddleware } from './middleware/auth';
import { logRequests } from './middleware/requestLogger';
import { logErrors } from './middleware/errorLogger';

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(logRequests);

app.post('/signin', login);
app.post('/signup', createUser);

app.use(authMiddleware);

app.use('/cards', cardsRouter);
app.use('/users', usersRouter);

app.use(logErrors);

app.use(errorHandler);

mongoose.connect(MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

export default app;
