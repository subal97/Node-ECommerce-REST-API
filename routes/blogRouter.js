const express = require('express');
const { CreateBlog, GetBlog, GetBlogs, DeleteBlog, UpdateBlog, LikeBlog, DislikeBlog } = require('../controller/blogController');
const { authenticate } = require('../middlewares/auth.middleware');
const router = express.Router();


router.post('/like', authenticate, LikeBlog);
router.post('/dislike', authenticate, DislikeBlog);

router.get('/:id', authenticate, GetBlog);
router.put('/:id', authenticate, UpdateBlog);
router.delete('/:id', authenticate, DeleteBlog);

router.get('/', authenticate, GetBlogs);
router.post('/', authenticate, CreateBlog);

module.exports = router;