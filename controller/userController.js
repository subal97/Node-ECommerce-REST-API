const User = require('../models/userModel');
const Cart = require('../models/cartModel');
const asyncHandler = require('express-async-handler');
const { createJWT, createRefreshToken} = require('../config/jwtService');
const jwt = require('jsonwebtoken');

const RegisterUser = asyncHandler(async function(req, res, next){
    const email = req.body.email;
    const user = await User.exists({ email: email});
    if(!user){
        const newUser = await User.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            mobile: req.body.mobile,
            password: req.body.password,
        });
        res.json({
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            email: newUser.email,
            mobile: newUser.mobile,
        });
    }else{        
        throw new Error('User already exits');
    }
});

const LoginUser = asyncHandler(async function(req, res, next){
    const {email, password} = req.body;
    let user = await User.findOne({ email: email});
    if(user && await user.ValidatePassword(password)){
        const refreshToken = await createRefreshToken(user._id);
        user = await User.findByIdAndUpdate(user._id, {refreshToken: refreshToken}, {new : true});
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72*3600*1000
        });
        res.status(200).json({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            token: await createJWT(user)
        });
    }else{
        throw new Error('Invalid credentials');
    }
});

const GetAllUsers = async function(req, res, next){
    const users = await User.find({});
    res.status(200).json({
        count: users.length,
        users: users
    });
};

const GetUser = asyncHandler(async function(req, res){
    try {
        const user = await User.findById(req.params.id);
        res.json({user});
    } catch (error) {
        throw new Error(error);
    }
});

const BlockUser = asyncHandler(async function(req, res, next){
    let user;
    try {
        user = await User.findOneAndUpdate({_id : req.params.id}, {blocked: true}, {new: true});
    } catch (error) {
        throw new Error(error);
    }
    res.status(200).json({
        user: user
    });
});

const UnBlockUser = asyncHandler(async function(req, res, next){
    let user;
    try {
        user = await User.findOneAndUpdate({_id : req.params.id}, {blocked: false}, {new: true});
    } catch (error) {
        throw new Error(error);
    }
    res.status(200).json({
        user: user
    });
});

const HandleTokenRefresh = asyncHandler(async function(req, res){
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error('Refresh Token not found. Please login');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken: refreshToken});
    if(!user) throw new Error('Invalid refresh token');
    jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {        
        if(err || user._id != decoded.id){
            throw new Error('Something wrong with the refresh token');
        }
        const token = await createJWT(user);
        res.json({token});
    });
});

const LogoutUser = asyncHandler(async function(req, res){
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error('No Refresh Token found in cookie.');
    const refreshToken = cookie.refreshToken;
    await User.findOneAndUpdate({refreshToken: refreshToken}, {refreshToken: ""});
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204);
});

const GetWishlist = asyncHandler(async(req, res)=>{
    try {
        const user = req.user;
        await user.populate('wishlist');
        const wishlist = user.wishlist;
        res.send({
            count: wishlist.length,
            wishlist: wishlist
        });
    } catch (error) {
        throw new Error(error);
    }
});

//takes care of removing from wishlist as well.
const AddToWishlist = asyncHandler(async(req, res)=>{
    const prodId = req.body?._id;
    let user = req.user;
    try {
        const index = user.wishlist.indexOf(prodId);
        if(index > -1){
            user.wishlist.splice(index,1);
        }else{
            user.wishlist.push(prodId);
        }
        user = await user.save();
        res.send({"wishlist": user.wishlist});
    } catch (error) {
        throw new Error(error);
    }
});

const SaveAddress = asyncHandler(async(req, res)=>{
    const userid = req.user?._id;
    try {
        const user = await User.findByIdAndUpdate(userid, {address: req.body.address}, {new: true} );
        res.send(user.address);
    } catch (error) {
        throw new Error(error);
    }
});

const GetCart = asyncHandler(async(req, res)=>{
    const userid = req.user?._id;
    try {
        const cart = await Cart.findById(userid);
        res.send({cart});
    } catch (error) {
        throw new Error(error);
    }
});

//TODO
const AddRemoveCartItem = asyncHandler(async(req, res, next)=>{
    const userid = req.user?._id;
    try {
        const cart = await Cart.findById(userid);
        res.send({cart});
    } catch (error) {
        throw new Error(error);
    }
});


module.exports = {
    RegisterUser,LoginUser,LogoutUser,
    HandleTokenRefresh,
    GetAllUsers, GetUser,
    BlockUser,UnBlockUser,
    GetWishlist,AddToWishlist,
    SaveAddress,
    GetCart, AddRemoveCartItem,
};