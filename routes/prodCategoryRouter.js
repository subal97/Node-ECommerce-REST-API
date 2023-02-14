const express = require('express');
const { CreateCategory, GetCategory, GetCategories, DeleteCategory, UpdateCategory } = require('../controller/prodCategoryController');
const { authenticate, isAdminUser } = require('../middlewares/auth.middleware');
const router = express.Router();


router.get('/:id', authenticate, GetCategory);
router.put('/:id', authenticate, isAdminUser, UpdateCategory);
router.delete('/:id', authenticate, isAdminUser, DeleteCategory);

router.get('/', authenticate, GetCategories);
router.post('/', authenticate, CreateCategory);

module.exports = router;