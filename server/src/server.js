import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';
import conceptRoutes from './routes/conceptRoutes.js';
import challengeRoutes from './routes/challengeRoutes.js';
import vivaRoutes from './routes/vivaRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import Concept from './models/Concept.js';
import { seedDatabase } from './seed/seedData.js';
import { applyDecayForStudent } from './services/knowledgeTracingService.js';
import StudentProfile from './models/StudentProfile.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Express Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  return res.json({
    status: 'ok',
    system: 'CogniTrace LMS Backend',
    timestamp: new Date(),
    mongoState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/concepts', conceptRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/viva', vivaRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/admin', adminRoutes);

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

// MongoDB Atlas Connection & Auto-Seed
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cognitrace_lms';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Successfully connected to MongoDB Atlas!');
    
    // Auto-seed if Concept collection is empty
    const count = await Concept.countDocuments();
    if (count === 0) {
      console.log('Database empty. Running initial seed...');
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`CogniTrace LMS Backend running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB Atlas:', err);
  });
