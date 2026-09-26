import express from 'express';
import { getBlogs, getBlogBySlug, createBlog, deleteBlog } from '../controllers/blogController.js';
import { verifyJWT, roleGuard } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);
router.post('/', verifyJWT, roleGuard(['teacher', 'admin']), createBlog);
router.delete('/:id', verifyJWT, roleGuard(['teacher', 'admin']), deleteBlog);

export default router;
