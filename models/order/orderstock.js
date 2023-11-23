const Joi = require("joi");
const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema

const ConfirmSchema = new mongoose.Schema({
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
   },
       timestamps:{
           type :Date,
           default :Date.now,
       }
     
   })
   
   
   const ConfirmOder  = mongoose.model("ConfirmOder", ConfirmSchema);
   
   module.exports = ConfirmOder;