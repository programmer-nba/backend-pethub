const Joi = require("joi");
const mongoose = require("mongoose");

const ProductShallall = new mongoose.Schema({
  product_id: {type: String, required: false},
  shop_id: {type: String, required: false},
  logo:{type: String, required: false},//รูปภาพสินค้า
  name: {type: String, required: false}, //ชื่อสินค้า
  barcode: {type: String, required: false}, // บาร์โค๊ดสินค้า
  ProductAmount: {type: Number, required: false},
  price_cost: {type: Number, required: false}, //ราคาต้นทุน
  price: {type: Number, required: false}, //ราคาสินค้า
  promotion:{type: String, required: false ,default:"" },//โปรโมชั่นของสินค้า
  discount:{type: Number, required: false }//ส่วนลดหลังจากใช้โปรโมชั่น
});

const ProductShall = mongoose.model("product_shall", ProductShallall);

const validateProductShall = (data) => {
  const schema = Joi.object({
    productShop_id: Joi.string().required(),
    productShop_barcode: Joi.string().default(""),
    productShop_status: Joi.boolean().required(true),
    productShop_stock: Joi.number().default(0),
    productShop_pethub_id: Joi.string().default("ไม่มี"),
  });
  return schema.validate();
};

module.exports = {ProductShall, validateProductShall};
