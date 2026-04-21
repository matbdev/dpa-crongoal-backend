import 'dotenv/config';
import express, { Request, Response, NextFunction } from "express";
import authRoute from './routes/auth.route'
import userRoute from './routes/user.route'
import projectRoute from './routes/project.route'
import taskRoute from './routes/task.route'
import kanbanRoute from './routes/kanbanColumn.route'
import rewardRoute from './routes/reward.route'
import routineRoute from './routes/routine.route'
import healthRoute from './routes/health.route'
import { globalErrorHandler } from './middlewares/errorHandler'
import passport from 'passport';
import cors from './utils/cors';
import rateLimit from './utils/rateLimiter';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 5000;

// Helmet - Security Headers
app.use(helmet());

// Rate limiting
app.use(rateLimit);

// CORS
app.use(cors);

// Body parser
app.use(express.json());

// Passport
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/project', projectRoute);
app.use('/api/task', taskRoute);
app.use('/api/kanban', kanbanRoute);
app.use('/api/reward', rewardRoute);
app.use('/api/routine', routineRoute);
app.use('/api/health', healthRoute);

// Global Error Handler
app.use(globalErrorHandler);

// Starts the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});