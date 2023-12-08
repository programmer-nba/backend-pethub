const mongoose = require("mongoose");
const Joi = require("joi");


const productPetHubchema = new mongoose.Schema({
    code: {type: String, required: false},
    product_id:{type: String, required: false},
    logo:{type: String, required: false},
    name:{type: String, required: false},
    name_product:{type: String, required: false},
    details_code: { type:  String, required: false},
    price_cost:{type: String,required: false},
    percent_timestamp: {type: Array, required: false, default: []},
  });
  
  const productpethubs = mongoose.model('ProductPethub',productPetHubchema);
  
  module.exports ={productpethubs};





  //