const Joi = require("joi");
const mongoose = require("mongoose");

const packsProducts = new mongoose.Schema( {
  product_id :{type:String,required:false},
  barcode: {type: String, required: false}, //บาร์โค๊ดสินค้า
  amount: {type: Number, required: false}, //จำนวนสินค้า
  price_cost: {type: Number, required: false}, //ราคาต้นทุน

});
  const PackProducts = mongoose.model("productpack",packsProducts);
  module.exports={PackProducts};