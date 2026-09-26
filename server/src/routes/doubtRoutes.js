import express from 'express';
import { getDoubts, createDoubt, replyDoubt, resolveDoubt } from '../controllers/doubtController.js';
import { verifyJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyJWT, getDoubts);
router.post('/', verifyJWT, createDoubt);
router.post('/:id/reply', verifyJWT, replyDoubt);
router.patch('/:id/resolve', verifyJWT, resolveDoubt);

export default router;
