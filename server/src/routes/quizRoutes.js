import express from 'express';
import {
  getQuizzes,
  getQuizById,
  submitQuizAttempt,
  submitDiagnosticAnswer,
} from '../controllers/quizController.js';
import { verifyJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getQuizzes);
router.get('/:id', getQuizById);
router.post('/submit', verifyJWT, submitQuizAttempt);
router.post('/diagnostic', verifyJWT, submitDiagnosticAnswer);

export default router;
