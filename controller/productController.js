const Product = require('../models/productModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const cloudinaryImageUploader = require('../utils/cloudinary');
const fs = require('fs');
const path = require('path');

const CreateProduct = asyncHandler(async (req, res) => {
    let product;
    if(req.body.title) req.body.slug = slugify(req.body.title);
    try {
        product = await Product.create(req.body);        
    } catch (error) {
        throw new Error(error);
    }    
    res.json({product});
});

const UpdateProduct = asyncHandler(async(req, res)=> {
    const id = req.params.id;
    if(req.body.title) req.body.slug = slugify(req.body.title);
    try {
        const product = await Product.findByIdAndUpdate(id, req.body, {new: true});
        res.json({product});
    } catch (error) {
        throw new Error(error);
    }
});

const GetAllProducts = asyncHandler(async (req, res) => {
    let queryObject = {...req.query};
    const excludedFields = ["pageNumber", "pageSize", "sort", "limit", "fields"];
    excludedFields.forEach(el => delete queryObject[el]);
    
    //filter
    let queryStr = JSON.stringify(queryObject).replace(/\b(gt|lt|gte|lte)\b/g, match => `$${match}`);
    let query = Product.find(JSON.parse(queryStr));

    //sort
    if(req.query.sort){
        let sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }else{
        query = query.sort('-createdAt');
    }

    //limiting the fields
    if(req.query.fields){
        let fields = req.query.fields.toString();
        fields = fields.concat(',').split(',').join(' ');
        console.log(fields);
        query.select(fields);
    }else{
        query.select('-__v');
    }

    //pagination
    if(req.query.pageNumber && req.query.pageSize){
        const productCount = await Product.countDocuments();
        const pageNumber = Number.parseInt(req.query.pageNumber) || 1;
        const pageSize = Number.parseInt(req.query.pageSize) || 5;
        const skip = (pageNumber - 1) * pageSize;
        if(skip >= productCount){
            throw new Error('Page does not exists');
        }
        query = query.skip(skip).limit(pageSize);
    }

    const products = await query.exec();
    res.json({
        count: products.length,
        products: products
    });
});

const GetProduct = asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
        const product = await Product.findById(id);
        res.json({product});
    } catch (error) {
        throw new Error("Product not found");
    }
});

const DeleteProduct = asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
        const product = await Product.findByIdAndDelete(id);
        res.sendStatus(204);
    } catch (error) {
        throw new Error("Product not found");
    }
});

const UploadImages = asyncHandler(async(req, res)=>{
    const prodId = req.params.id;
    try {
        const cloudUploader = path => cloudinaryImageUploader(path);
        const files = req.files;
        const cloudUrls = [];
        for(let file of files){
            const fpath = path.join(file.destination, '/products/', file.filename);
            const cloudUrl = await cloudUploader(fpath);
            cloudUrls.push(cloudUrl);
            fs.unlinkSync(fpath);
        }
        const product = await Product.findByIdAndUpdate(prodId, {
            images: cloudUrls
        });
        res.send({product});
    } catch (error) {
        throw new Error(error);
    }
});


module.exports = {
    GetAllProducts,GetProduct,
    CreateProduct,UpdateProduct,DeleteProduct,
    UploadImages
}