import express from 'express';
import { initiateViva, answerVivaQuestion, finalizeViva } from '../controllers/vivaController.js';
import { verifyJWT } from '../middleware/authMiddleware.js';
import { vivaLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/initiate', verifyJWT, vivaLimiter, initiateViva);
router.patch('/:id/answer', verifyJWT, vivaLimiter, answerVivaQuestion);
router.post('/:id/finalize', verifyJWT, vivaLimiter, finalizeViva);

export default router;
