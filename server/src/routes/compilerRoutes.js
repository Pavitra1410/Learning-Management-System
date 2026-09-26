import express from 'express';
import { executeCode } from '../controllers/compilerController.js';
import { submitLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/execute', submitLimiter, executeCode);

export default router;
