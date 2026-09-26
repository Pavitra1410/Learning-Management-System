import express from 'express';
import { getStudentRecommendations } from '../controllers/recommendationController.js';
import { verifyJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyJWT, getStudentRecommendations);

export default router;
