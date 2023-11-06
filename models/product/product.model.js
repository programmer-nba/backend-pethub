const Joi = require("joi");
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {type: String, required: true}, //ชื่อสินค้า
  barcode: {type: String, required: true}, //บาร์โค๊ดสินค้า
  category: {type: String, required: true}, //ประเภทสินค้า
  dealer: {type: String, required: true}, //คู่ค้า
  quantity: {type: Number, required: true}, //จำนวนสินค้า
  price_cost: {type: Number, required: true}, //ราคาต้นทุน
});

const Products = mongoose.model("product", ProductSchema);

const validateproduct = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label("กรุณากรอกเลขบัตรผู้ใช้ด้วย"),
    barcode: Joi.string().required().label("กรุณากรอกบาร์โค๊ดสินค้า"),
    category: Joi.string().required().label("กรุณากรอกประเภทสินค้า"),
    dealer: Joi.string().required().label("กรุณากรอกคู่ค้า"),
    quantity: Joi.number().required().label("กรุณากรอกจำนวนสินค้า"),
    price_cost: Joi.number().required().label("กรุณากรอกต้นทุนสินค้า"),
  });
  return schema.validate(data);
};

module.exports = {Products, validateproduct};
