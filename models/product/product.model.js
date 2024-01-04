const Joi = require("joi");
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  logo: {type: String, required: false},
  name: {type: String, required: true}, //ชื่อสินค้า
  barcode: {type: String, required: true}, //บาร์โค๊ดสินค้า
  category: {type: String, required: true}, //ประเภทสินค้า หรือรุ่น
  productgroup :{type: String, required: false},//ชื่อกลุ่มสินค้า
  bands  :{type: String, required: false},//ชื่อเเบรน์สินค้า
  size:{type: String, required: false},//ขนาดของสินค้า
  taste:{type: String, required: false,},//รสชาติของสินค้า
  supplier_id: {type: String}, //คู่ค้า
  quantity: {type: Number, required: false}, //จำนวนสินค้า
  price_cost: {type: Number, required: false}, //ราคาต้นทุน
  retailprice:{
    type: [
      {
        level1: { type: Number, required: false },
        level2: { type: Number, required: false },
        level3: { type: Number, required: false },
        level4: { type: Number, required: false },
        level5: { type: Number, required: false },
      },
    ],
  },//ราคาปลีก
  wholesaleprice:{
    type: [
      {
        level1: { type: Number, required: false },
        level2: { type: Number, required: false },
        level3: { type: Number, required: false },
        level4: { type: Number, required: false },
        level5: { type: Number, required: false },
      },
    ],
  },//ราคาส่ง
  memberretailprice:{
    type: [
      {
        level1: { type: Number, required: false },
        level2: { type: Number, required: false },
        level3: { type: Number, required: false },
        level4: { type: Number, required: false },
        level5: { type: Number, required: false },
      },
    ],
  },//ราคาปลีกสมาชิก
  memberwholesaleprice:{
    type: [
      {
        level1: { type: Number, required: false },
        level2: { type: Number, required: false },
        level3: { type: Number, required: false },
        level4: { type: Number, required: false },
        level5: { type: Number, required: false },
      },
    ],
  },//ราคาส่งสมาชิก
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
