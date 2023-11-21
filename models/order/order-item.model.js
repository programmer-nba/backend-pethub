const Joi = require("joi");
const mongoose = require("mongoose");


const ProductItemSchema = new mongoose.Schema({
    quantity :{
        type : Number,
        require : true
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Product'
    },
    name :{
        type : String,
        ref:'warunyoo'
        },

    
})

const OrderItem = mongoose.model("OrderItem", ProductItemSchema);

module.exports = OrderItem;
