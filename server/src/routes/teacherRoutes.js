import express from 'express';
import { getIllusionMatrix, resetDemo, getTeacherAnalytics } from '../controllers/teacherController.js';
import { verifyJWT, roleGuard } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/analytics', verifyJWT, roleGuard(['teacher', 'admin']), getTeacherAnalytics);
router.get('/cohort/illusion-matrix', verifyJWT, roleGuard(['teacher', 'admin']), getIllusionMatrix);
router.post('/reset-demo', verifyJWT, roleGuard(['teacher', 'admin']), resetDemo);

export default router;
