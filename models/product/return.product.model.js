const Joi = require("joi");
const mongoose = require("mongoose");

const returnproduct = new mongoose.Schema( {
  product_id :{type:String,required:false},
  logo:{type: String, required: false},//รูปภาพสินค้า
  name: {type: String, required: false},
  name_pack:{type: String, required: false},
  barcode: {type: String, required: false}, //บาร์โค๊ดสินค้า
  amount: {type: Number, required: false}, //จำนวนสินค้า
  total_price:{type: Number, required: false}, //ราคาเเพ็คสินค้า
  price_cost: {type: Number, required: false}, //ราคาต้นทุน

});
  const ReturnProduct = mongoose.model("ReturnProduct",returnproduct);
  module.exports={ReturnProduct};