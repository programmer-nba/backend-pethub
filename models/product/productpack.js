const Joi = require("joi");
const mongoose = require("mongoose");

const packsProducts = new mongoose.Schema( {
  product_id :{type:Number,required:true},
  logo: {type: String, required: true},
  name: {type: String, required: true}, //ชื่อสินค้า
  barcode: {type: String, required: true}, //บาร์โค๊ดสินค้า
  category: {type: String, required: true}, //ประเภทสินค้า
  supplier_id: {type: String, required: true}, //คู่ค้า
  quantity: {type: Number, required: true}, //จำนวนสินค้า
  price_cost: {type: Number, required: true}, //ราคาต้นทุน
  status: {type: Boolean, required: false, default: true},
});
  const PackProducts = mongoose.model("productpack",packsProducts);
  const validatePackProducts = (data) => {
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
  module.exports={PackProducts,validatePackProducts};