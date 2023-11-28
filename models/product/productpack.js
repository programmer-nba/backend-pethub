const Joi = require("joi");
const mongoose = require("mongoose");

const packsProducts = new mongoose.Schema( {
  product_id :{type:Number,required:true},
  barcode: {type: String, required: true}, //บาร์โค๊ดสินค้า
  quantity: {type: Number, required: true}, //จำนวนสินค้า
  price_cost: {type: Number, required: true}, //ราคาต้นทุน

});
  const PackProducts = mongoose.model("productpack",packsProducts);
  module.exports={PackProducts};