const mongoose = require("mongoose");
const Joi = require("joi");

const promotionByFreeSchema  = new mongoose.Schema({
    product_id:{type: String, required: false },
    name: { type: String, required: true },
    description: { type: String, required: true },
    buyQty: { type: Number, required: true },  // จำนวนที่ต้องซื้อ
    freeQty: { type: Number, required: true }, // จำนวนที่ได้ฟรี
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  });
  
  const PromotionFree  = mongoose.model('PromotionFree',promotionByFreeSchema );
  const validatePromotionFree = (data) => {
    const schema = Joi.object({
      name: Joi.string().required().label("กรุณากรอกชื่อโปรโมขั่น"),
      description: Joi.string().required().label("กรุณากรอกรายละเอียดโปรโมชั่น"),
      buyQty: Joi.string().required().label("กรุณากรอกจำนวนสินค้าที่ต้องการชื้อ"),
      freeQty: Joi.string().required().label("กรุณากรอกจำนวนสินค้าที่ได้ฟรี"),
    });
    return schema.validate(data);
  };
  
  module.exports ={PromotionFree,validatePromotionFree};