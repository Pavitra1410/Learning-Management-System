import express from 'express';
import { getGraph, getConceptBySlug, createConcept } from '../controllers/conceptController.js';
import { verifyJWT, roleGuard } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public / optional auth for graph rendering
router.get('/graph', (req, res, next) => {
  // Optional auth middleware
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return verifyJWT(req, res, next);
  }
  next();
}, getGraph);

router.get('/:slug', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return verifyJWT(req, res, next);
  }
  next();
}, getConceptBySlug);

router.post('/', verifyJWT, roleGuard(['admin', 'teacher']), createConcept);

export default router;
