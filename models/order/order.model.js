const Joi = require("joi");
const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema


const OrderSchema = new mongoose.Schema({
 order_id :{
    type : String,
    },
  name :{
    type : String,
    ref:'Product'
    },
  category: {
    type : String,
    require:true
    },
  quantity: {
    type : Number,
    require:true
 },
 productdetails : {
    type : String,
    require:true
 },
   status:{
    type :String,
    require :true,
    default :''
},
    timestamps:{
        type :Date,
        default :Date.now,
    }
  
})


const order = mongoose.model("Order", OrderSchema);

module.exports = order;
