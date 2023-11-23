const Joi = require("joi");
const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema


const OrderSchema = new mongoose.Schema({
    id:{
        type:Number
    },
    shop_id:{
        type:Number
    },
    invoice:{
        type:String
    },
    employee_name:{
        type : String,
    },
    product_name:{
        type : String,
    },
   status:{
    type :String,
    
    },
    timestamps:{
        type :Date,
        default :Date.now,
    },
  
})


const order = mongoose.model("Order", OrderSchema);

module.exports = order;
