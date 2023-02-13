const express = require('express');
const { RegisterUser, LoginUser, GetAllUsers, BlockUser, UnBlockUser, GetUser, HandleTokenRefresh, LogoutUser } = require('../controller/userController');
const { authenticate, isAdminUser } = require('../middlewares/auth.middleware');
const router = express.Router();

//auth endpoints
router.post('/register', RegisterUser);
router.post('/login', LoginUser);
router.get('/logout', LogoutUser);
router.get('/refresh', HandleTokenRefresh);

//admin endpoints
router.get('/all-users', authenticate, isAdminUser, GetAllUsers);
router.get('/block/:id', authenticate, isAdminUser, BlockUser);
router.get('/unblock/:id', authenticate, isAdminUser, UnBlockUser);

//general user endpoints
router.get('/:id', authenticate, isAdminUser, GetUser);

module.exports = router;