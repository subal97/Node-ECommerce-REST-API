const Coupon = require('../models/couponModel');
const asyncHandler = require('express-async-handler')

const CreateCoupon = asyncHandler(async(req, res)=>{
    try{
        const coupon = await Coupon.create(req.body);
        res.json({coupon});
    }catch(err){
        throw new Error(err);
    }
});

const GetCoupon = asyncHandler(async (req, res)=>{
    const id = req.params.id;
    try {
        const coupon = await Coupon.findById(id);
        res.json({coupon});
    } catch (error) {
        throw new Error(error);
    }
});

const GetCoupons = asyncHandler(async (req, res)=>{
    try {
        const coupons = await Coupon.find({});
        res.json({
            count: coupons.length,
            Coupons: coupons
        });
    } catch (error) {
        throw new Error(error);
    }
});

const UpdateCoupon = asyncHandler(async (req, res)=>{
    const id = req.params.id;
    try {
        const coupon = await Coupon.findByIdAndUpdate(id, req.body, {new: true});
        res.json({coupon});
    } catch (error) {
        throw new Error(error);
    }
});

const DeleteCoupon = asyncHandler(async (req, res)=>{
    const id = req.params.id;
    try {
        await Coupon.findByIdAndDelete(id);
        res.sendStatus(204);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    CreateCoupon,
    GetCoupon, GetCoupons,
    UpdateCoupon, DeleteCoupon
}