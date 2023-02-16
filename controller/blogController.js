const Blog = require('../models/blogModel')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const cloudinaryImageUploader = require('../utils/cloudinary');
const fs = require('fs');
const path = require('path');

const GetBlog = asyncHandler(async(req, res) => {
    try {
        const id = req.params.id;
        const blog = await Blog.findByIdAndUpdate(id, {
            $inc:{'numViews':1}
        }, {new: true});
        res.json({blog});
    } catch (error) {
        throw new Error(error);
    }
});

const CreateBlog = asyncHandler(async(req, res)=>{    
    try {
        const blog = await Blog.create(req.body);
        res.json({blog});
    } catch (err) {
        throw new Error(err);
    }
});

const GetBlogs = asyncHandler(async (req, res) =>{
    try {
        const blogs = await Blog.find({});
        res.json({
            count: blogs.length,
            blogs: blogs
        });
    } catch (error) {
        throw new Error(error);
    }
});

const DeleteBlog = asyncHandler(async(req, res) => {
    try {
        const id = req.params.id;
        await Blog.findByIdAndDelete(id);
        res.sendStatus(204);
    } catch (error) {
        throw new Error(error);
    }
});

const UpdateBlog = asyncHandler(async(req, res) => {
    try {
        const id = req.params.id;
        const blog = await Blog.findByIdAndUpdate(id, req.body, {new : true});
        res.json({blog});
    } catch (error) {
        throw new Error(error);
    }
});

const LikeBlog = asyncHandler(async(req, res) =>{
    const blogid = req.body._id;
    const userid = req.user?._id;

    try {
        let blog = await Blog.findById(blogid);
        
        //if already liked
        let index = blog.likes.indexOf(userid);
        if(index > -1){
            blog.likes.splice(index, 1);
            blog.isLiked = false;
        }else{
            blog.likes.push(userid);
            blog.isLiked = true;
        }

        //if already disliked 
        index = blog.dislikes.indexOf(userid);
        if(index > -1){
            blog.dislikes.splice(index, 1);
            blog.isDisliked = false;
        }
        await blog.save();
        res.sendStatus(200);
    } catch (error) {
        throw new Error(error);
    }
});

const DislikeBlog = asyncHandler(async(req, res) =>{
    const blogid = req.body._id;
    const userid = req.user?._id;

    try {
        let blog = await Blog.findById(blogid);
        
        //if already liked
        let index = blog.likes.indexOf(userid);
        blog.isLiked = false;
        if(index > -1){
            blog.likes.splice(index, 1);
        }

        //if already disliked 
        index = blog.dislikes.indexOf(userid);
        if(index > -1){
            blog.dislikes.splice(index, 1);
            blog.isDisliked = false;
        }else{
            blog.dislikes.push(userid);
            blog.isDisliked = true;
        }
        await blog.save();
        res.sendStatus(200);

    } catch (error) {
        throw new Error(error);
    }
});

const UploadImages = asyncHandler(async(req, res)=>{
    const blogId = req.params.id;
    try {
        const cloudUploader = path => cloudinaryImageUploader(path);
        const files = req.files;
        const cloudUrls = [];
        for(let file of files){
            const fpath = path.join(file.destination, '/blogs/', file.filename);
            const cloudUrl = await cloudUploader(fpath);
            cloudUrls.push(cloudUrl);
            fs.unlinkSync(fpath);
        }
        const blog = await Blog.findByIdAndUpdate(blogId, {
            images: cloudUrls
        });
        res.send({blog});
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    GetBlog, GetBlogs, 
    CreateBlog, DeleteBlog,
    UpdateBlog,
    LikeBlog, DislikeBlog,
    UploadImages
}