import { Router } from 'express';
import { createBlogPost, updateBlogPost } from '../controllers/blog.controller';

const router = Router();

router.post('/', createBlogPost);
router.put('/:id', updateBlogPost);

export default router;
