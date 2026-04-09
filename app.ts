import express, { Request, Response } from "express";
import authRoute from './routes/authRoute'
import userRoute from './routes/userRoute'
import passport from 'passport';

const app = express();
const PORT = 5000;

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

// Starts the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});