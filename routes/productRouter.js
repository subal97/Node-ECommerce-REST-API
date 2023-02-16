const express = require('express');
const { GetAllProducts, GetProduct, CreateProduct, UpdateProduct, DeleteProduct, AddToWishlist } = require('../controller/productController');
const { authenticate, isAdminUser } = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/all', authenticate, GetAllProducts);
router.post('/create', authenticate, CreateProduct);
router.post('/wishlist', authenticate, AddToWishlist);

router.get('/:id', authenticate, GetProduct);
router.put('/:id', authenticate, isAdminUser, UpdateProduct);
router.delete('/:id', authenticate, isAdminUser, DeleteProduct);

module.exports = router;