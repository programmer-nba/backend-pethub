const Joi = require("joi");
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  logo: {type: String, required: false},
  name: {type: String, required: true}, //ชื่อสินค้า
  barcode: {type: String, required: true}, //บาร์โค๊ดสินค้า
  category: {type: String, required: true}, //ประเภทสินค้า หรือรุ่น
  productgroup :{type: String, required: true},//ชื่อกลุ่มสินค้า
  bands  :{type: String, required: true},//ชื่อเเบรน์สินค้า
  size:{type: String, required: true},//ขนาดของสินค้า
  taste:{type: String, required: true},//รสชาติของสินค้า
  supplier_id: {type: String}, //คู่ค้า
  quantity: {type: Number, required: true}, //จำนวนสินค้า
  price_cost: {type: Number, required: true}, //ราคาต้นทุน
  retailprice:{type: Number, required: true},//ราคาปลีก
  wholesaleprice:{type: Number, required: true},//ราคาส่ง
  memberretailprice:{type: Number, required: true},//ราคาปลีกสมาชิก
  memberwholesaleprice:{type: Number, required: true},//ราคาส่งสมาชิก
  status: {type: Boolean, required: false, default: true},
});

const Products = mongoose.model("product", ProductSchema);

const validateproduct = (data) => {
  const schema = Joi.object({
    logo: Joi.string().required().label("กรุณาใส่รูปภาพสินค้า"),
    name: Joi.string().required().label("กรุณากรอกเลขบัตรผู้ใช้ด้วย"),
    barcode: Joi.string().required().label("กรุณากรอกบาร์โค๊ดสินค้า"),
    category: Joi.string().required().label("กรุณากรอกประเภทสินค้า"),
    supplier_id: Joi.string().required().label("กรุณากรอกคู่ค้า"),
    quantity: Joi.number().required().label("กรุณากรอกจำนวนสินค้า"),
    price_cost: Joi.number().required().label("กรุณากรอกต้นทุนสินค้า"),
    status: Joi.boolean().default(true)
  });
  return schema.validate(data);
};

module.exports = {Products, validateproduct};
