import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import conceptRoutes from './routes/conceptRoutes.js';
import challengeRoutes from './routes/challengeRoutes.js';
import vivaRoutes from './routes/vivaRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import doubtRoutes from './routes/doubtRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import webinarRoutes from './routes/webinarRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import compilerRoutes from './routes/compilerRoutes.js';

import Concept from './models/Concept.js';
import { seedDatabase } from './seed/seedData.js';
import { applyDecayForStudent } from './services/knowledgeTracingService.js';
import StudentProfile from './models/StudentProfile.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Express Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://learningmanagementsytem-git-main-pavitras-projects-b44af745.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, origin);
    }
    return callback(null, origin);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-idempotency-key'],
}));

app.options('*', cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  return res.json({
    status: 'ok',
    system: 'CogniTrace Adaptive LMS Backend',
    timestamp: new Date(),
    mongoState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/concepts', conceptRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/viva', vivaRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/doubts', doubtRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/webinars', webinarRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/compiler', compilerRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/admin', adminRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend assets if built
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) next();
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  return res.status(500).json({
    error: 'SERVER_ERROR',
    message: err.message || 'Internal server error occurred',
  });
});

// Ebbinghaus Memory Decay Scheduler (Runs every 6 hours)
const DECAY_INTERVAL_MS = 6 * 60 * 60 * 1000;
setInterval(async () => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeProfiles = await StudentProfile.find({ updatedAt: { $gte: thirtyDaysAgo } }, { userId: 1 }).lean();

    let decayCount = 0;
    for (const profile of activeProfiles) {
      const changes = await applyDecayForStudent(profile.userId.toString());
      decayCount += changes.length;
    }
    console.log(`[Decay Scheduler] Processed ${activeProfiles.length} profiles, decayed ${decayCount} concept masteries.`);
  } catch (err) {
    console.error('[Decay Scheduler Error]:', err.message);
  }
}, DECAY_INTERVAL_MS);

// Listen on 0.0.0.0
app.listen(PORT, '0.0.0.0', () => {
  console.log(`CogniTrace LMS Backend running on port ${PORT}`);
});

// MongoDB Atlas Connection & Auto-Seed
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cognitrace_lms';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Successfully connected to MongoDB Atlas!');
    const count = await Concept.countDocuments();
    if (count === 0) {
      console.log('Database empty. Running initial seed...');
      await seedDatabase();
    }
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB Atlas:', err.message);
  });
