import express from 'express';
import { checkCycles, getAdminStats, updateUserRole, deleteUser } from '../controllers/adminController.js';
import { verifyJWT, roleGuard } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', verifyJWT, roleGuard(['admin']), getAdminStats);
router.patch('/users/:id/role', verifyJWT, roleGuard(['admin']), updateUserRole);
router.delete('/users/:id', verifyJWT, roleGuard(['admin']), deleteUser);
router.get('/cycles', verifyJWT, roleGuard(['admin', 'teacher']), checkCycles);

export default router;
