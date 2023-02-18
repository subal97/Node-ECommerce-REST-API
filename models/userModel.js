const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    roles: {
        type: [String],
        default: ['user']
    },
    cart:{
        type: Array,
        default: []
    },
    address: {type: String},
    wishlist: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Product" }],

    blocked: {type:Boolean, default: false},
    refreshToken : {type: String},
    },

    {
        timestamps: true
    }
);

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.ValidatePassword = async function(input_password){    
    return await bcrypt.compare(input_password, this.password);
};

//TODO : Update and Reset password
userSchema.methods.UpdatePassword = async function(input_password){
};

//Export the model
module.exports = mongoose.model('User', userSchema); 