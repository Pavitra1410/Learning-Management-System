import express from 'express';
import { getMyProfile } from '../controllers/profileController.js';
import { verifyJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', verifyJWT, getMyProfile);

export default router;
