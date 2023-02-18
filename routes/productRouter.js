const express = require('express');
const { GetAllProducts, GetProduct, CreateProduct, UpdateProduct, DeleteProduct, UploadImages } = require('../controller/productController');
const { authenticate, isAdminUser } = require('../middlewares/auth.middleware');
const { uploadImage, prodImageResize } = require('../middlewares/uploadImages.middleware');
const router = express.Router();

router.get('/all', authenticate, GetAllProducts);
router.post('/create', authenticate, CreateProduct);
router.put('/upload/:id', authenticate, isAdminUser, uploadImage.array('images', 10), prodImageResize, UploadImages);

router.get('/:id', authenticate, GetProduct);
router.put('/:id', authenticate, isAdminUser, UpdateProduct);
router.delete('/:id', authenticate, isAdminUser, DeleteProduct);

module.exports = router;