import express, { Request, Response, NextFunction } from "express";
import authRoute from './routes/authRoute'
import userRoute from './routes/userRoute'
import passport from 'passport';

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(passport.initialize());

// authRoute
app.use('/api/oauth', authRoute);

// userRoute
app.use('/api/user', userRoute);

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[ERROR]:', err.message);

  res.status(500).json({
    error: 'Something went wrong.'
  });
});

// Starts the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});