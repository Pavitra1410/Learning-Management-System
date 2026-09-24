import express from 'express';
import { getChallenges, getChallengeById, submitChallenge } from '../controllers/challengeController.js';
import { verifyJWT } from '../middleware/authMiddleware.js';
import { submitLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/', getChallenges);
router.get('/:id', getChallengeById);
router.post('/:id/submit', verifyJWT, submitLimiter, submitChallenge);

export default router;
