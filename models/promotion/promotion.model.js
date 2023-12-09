const mongoose = require("mongoose");
const Joi = require("joi");


const promotionSchema  = new mongoose.Schema({
    product_id:{type: String, required: false },
    name: { type: String, required: true },
    description: { type: String, required: false },
    discountPercentage: { type: Number, required: false },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  });
  
  const Promotion  = mongoose.model('Promotion',promotionSchema );
  
  module.exports ={Promotion};





  //