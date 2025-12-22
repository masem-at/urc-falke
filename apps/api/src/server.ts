import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes (will be added in later stories)
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/events', eventRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    type: 'https://urc-falke.app/errors/internal-server-error',
    title: 'Internal Server Error',
    status: 500,
    detail: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
});

export { app };
