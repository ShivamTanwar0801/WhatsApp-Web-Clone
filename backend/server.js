import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import messagesRouter from './routes/messages.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  }
});

// --- Socket.IO attachment to requests --- //
app.set('io', io);

// --- Middleware --- //
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*'}));
app.use(express.json({ limit: '1mb' }));

// --- Health check --- //
app.get('/api/health', (req, res) => {
  res.status(StatusCodes.OK).json({ ok: true, env: process.env.NODE_ENV || 'development' });
});

// --- API Routes --- //
app.use('/api', messagesRouter);

// --- Mongo Connection & Server Start --- //
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in environment.');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    httpServer.listen(PORT, () => console.log(`API + WS on :${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// --- Socket.IO Events (optional logging) --- //
io.on('connection', (socket) => {
  console.log('Client connected', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected', socket.id));
});
