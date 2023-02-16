const express = require('express');
const { CreateBrand, GetBrand, GetBrands, DeleteBrand, UpdateBrand } = require('../controller/brandController');
const { authenticate, isAdminUser } = require('../middlewares/auth.middleware');
const router = express.Router();


router.get('/:id', authenticate, GetBrand);
router.put('/:id', authenticate, isAdminUser, UpdateBrand);
router.delete('/:id', authenticate, isAdminUser, DeleteBrand);

router.get('/', authenticate, GetBrands);
router.post('/', authenticate, CreateBrand);

module.exports = router;