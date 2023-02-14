const Category = require('../models/prodCategoryModel');
const asyncHandler = require('express-async-handler')

const CreateCategory = asyncHandler(async(req, res)=>{
    try{
        const category = await Category.create(req.body);
        res.json({category});
    }catch(err){
        throw new Error(err);
    }
});

const GetCategory = asyncHandler(async (req, res)=>{
    const id = req.params.id;
    try {
        const category = await Category.findById(id);
        res.json({category});
    } catch (error) {
        throw new Error(error);
    }
});

const GetCategories = asyncHandler(async (req, res)=>{
    try {
        const categories = await Category.find({});
        res.json({
            count: categories.length,
            categories: categories
        });
    } catch (error) {
        throw new Error(error);
    }
});

const UpdateCategory = asyncHandler(async (req, res)=>{
    const id = req.params.id;
    try {
        const category = await Category.findByIdAndUpdate(id, req.body, {new: true});
        res.json({category});
    } catch (error) {
        throw new Error(error);
    }
});

const DeleteCategory = asyncHandler(async (req, res)=>{
    const id = req.params.id;
    try {
        await Category.findByIdAndDelete(id);
        res.sendStatus(204);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    CreateCategory,
    GetCategory, GetCategories,
    UpdateCategory, DeleteCategory
}