import express from 'express';
import { getQuestions, createQuestion, deleteQuestion } from '../controllers/questionController.js';
import { verifyJWT, roleGuard } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getQuestions);
router.post('/', verifyJWT, roleGuard(['teacher', 'admin']), createQuestion);
router.delete('/:id', verifyJWT, roleGuard(['teacher', 'admin']), deleteQuestion);

export default router;
