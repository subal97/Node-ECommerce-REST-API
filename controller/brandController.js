const Brand = require('../models/brandModel');
const asyncHandler = require('express-async-handler')

const CreateBrand = asyncHandler(async(req, res)=>{
    try{
        const brand = await Brand.create(req.body);
        res.json({brand});
    }catch(err){
        throw new Error(err);
    }
});

const GetBrand = asyncHandler(async (req, res)=>{
    const id = req.params.id;
    try {
        const brand = await Brand.findById(id);
        res.json({brand});
    } catch (error) {
        throw new Error(error);
    }
});

const GetBrands = asyncHandler(async (req, res)=>{
    try {
        const brands = await Brand.find({});
        res.json({
            count: brands.length,
            brands: brands
        });
    } catch (error) {
        throw new Error(error);
    }
});

const UpdateBrand = asyncHandler(async (req, res)=>{
    const id = req.params.id;
    try {
        const brand = await Brand.findByIdAndUpdate(id, req.body, {new: true});
        res.json({brand});
    } catch (error) {
        throw new Error(error);
    }
});

const DeleteBrand = asyncHandler(async (req, res)=>{
    const id = req.params.id;
    try {
        await Brand.findByIdAndDelete(id);
        res.sendStatus(204);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    CreateBrand,
    GetBrand, GetBrands,
    UpdateBrand, DeleteBrand
}