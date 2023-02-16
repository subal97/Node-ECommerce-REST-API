const express = require('express');
const { CreateCoupon, GetCoupon, GetCoupons, DeleteCoupon, UpdateCoupon } = require('../controller/couponController');
const { authenticate, isAdminUser } = require('../middlewares/auth.middleware');
const router = express.Router();


router.get('/:id', authenticate, GetCoupon);
router.put('/:id', authenticate, isAdminUser, UpdateCoupon);
router.delete('/:id', authenticate, isAdminUser, DeleteCoupon);

router.get('/', authenticate, GetCoupons);
router.post('/', authenticate, CreateCoupon);

module.exports = router;