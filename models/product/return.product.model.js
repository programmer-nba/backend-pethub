const Joi = require("joi");
const mongoose = require("mongoose");

const returnproduct = new mongoose.Schema( {
        product_id: {type: String, required: false},
        product_name: {type: String, required: false},
        product_amount: {type: Number, required: false},
        product_price: {type: Number, required: false},
        product_logo: {type: String, required: false},
        barcode: {type: String, required: false},
        price_cost: {type: Number, required: false}, //ราคาต้นทุน //บาร์โค๊ดสินค้
        status: {type: Boolean, required: false, default: true},
});
  const ReturnProduct = mongoose.model("ReturnProduct",returnproduct);
  module.exports={ReturnProduct};