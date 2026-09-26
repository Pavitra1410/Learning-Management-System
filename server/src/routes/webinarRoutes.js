import express from 'express';
import { getWebinars, createWebinar, registerForWebinar } from '../controllers/webinarController.js';
import { verifyJWT, roleGuard } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getWebinars);
router.post('/', verifyJWT, roleGuard(['teacher', 'admin']), createWebinar);
router.post('/:id/register', verifyJWT, registerForWebinar);

export default router;
