const express = require('express');
const { CreateBlog, GetBlog, GetBlogs, DeleteBlog, UpdateBlog, LikeBlog, DislikeBlog, UploadImages } = require('../controller/blogController');
const { authenticate, isAdminUser } = require('../middlewares/auth.middleware');
const { blogImageResize, uploadImage } = require('../middlewares/uploadImages.middleware');
const router = express.Router();


router.post('/like', authenticate, LikeBlog);
router.post('/dislike', authenticate, DislikeBlog);
router.put('/upload/:id', authenticate, isAdminUser, uploadImage.array('images', 2), blogImageResize, UploadImages);

router.get('/:id', authenticate, GetBlog);
router.put('/:id', authenticate, UpdateBlog);
router.delete('/:id', authenticate, DeleteBlog);

router.get('/', authenticate, GetBlogs);
router.post('/', authenticate, CreateBlog);

module.exports = router;