const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numViews:{
        type:Number,
        default:0,
    },
    isLiked: {
        type: Boolean,
        default: false,
    },
    isDisliked: {
        type: Boolean,
        default: false,
    },
    likes: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    }],
    dislikes: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    }],
    images: {
        type: String,
        default: "https://thumbs.dreamstime.com/b/blog-information-website-concept-workplace-background-text-view-above-127465079.jpg"
    },
    author:{
        type: String,
        default: "admin",
    }
},
    {
        toJSON: {
            virtuals: true,
        },
        toObject:{
            virtuals: true
        },
        timestamps: true,
    }
);

//Export the model
module.exports = mongoose.model('Blog', blogSchema);