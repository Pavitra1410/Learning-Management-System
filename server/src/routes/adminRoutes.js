import express from 'express';
import { checkCycles } from '../controllers/adminController.js';
import { verifyJWT, roleGuard } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/concepts/cycle-check', verifyJWT, roleGuard(['admin']), checkCycles);

export default router;
