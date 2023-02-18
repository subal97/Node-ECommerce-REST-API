const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
    products:[{
        product:{type: mongoose.SchemaTypes.ObjectId, ref: "Product"},
        count: Number,
        color: String,
        price: Number,
    }],
    cartTotal: Number,
    cartTotalAfterDiscount: Number,
    orderedBy: {type : mongoose.SchemaTypes.ObjectId, ref: "User"},
},
    {
        timestamps: true,
    }
);

//Export the model
module.exports = mongoose.model('Cart', cartSchema);