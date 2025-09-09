import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import WebSocket from 'ws';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import callRoutes from './routes/calls';
import projectRoutes from './routes/projects';
import taskRoutes from './routes/tasks';
import updateRoutes from './routes/updates';
import { setupWebSocket } from './websocket/server';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/calls', callRoutes);
app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);
app.use('/updates', updateRoutes);

// Error handling middleware
app.use(errorHandler);

// Setup WebSocket server
const wss = new WebSocket.Server({ server });
setupWebSocket(wss);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket server running on port ${PORT}`);
});

export default app;