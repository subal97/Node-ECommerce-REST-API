const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    products:[{
        product:{type: mongoose.SchemaTypes.ObjectId, ref: "Product"},
        count: Number,
        color: String,
    }],
    paymentIntent: {},
    orderStatus:{
        type: String,
        default: "Not processed",
        enum:[
            "Cancelled", "Not processed", "COD", "Processing", "Dispatched", "Delivered"
        ],
        orderedBy: {type : mongoose.SchemaTypes.ObjectId, ref: "User"},
    }},
    {
        timestamps: true,
    }
);

//Export the model
module.exports = mongoose.model('Order', orderSchema);