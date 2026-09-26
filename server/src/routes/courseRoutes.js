import express from 'express';
import {
  getAllCourses,
  getCourseBySlug,
  enrollCourse,
  updateLessonProgress,
  getStudentEnrolledCourses,
  createCourse,
} from '../controllers/courseController.js';
import { verifyJWT, roleGuard } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllCourses);
router.get('/my-courses', verifyJWT, getStudentEnrolledCourses);
router.get('/:slug', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return verifyJWT(req, res, next);
  }
  next();
}, getCourseBySlug);

router.post('/enroll', verifyJWT, enrollCourse);
router.post('/progress', verifyJWT, updateLessonProgress);
router.post('/', verifyJWT, roleGuard(['teacher', 'admin']), createCourse);

export default router;
