const mongoose = require("mongoose");
const Joi = require("joi");

const ShopSchema = new mongoose.Schema({
  shop_name: {type: String, required: true}, //ชื่อช้อป
  shop_status: {type: Boolean, required: false, default: true}, //สถานะช้อป
});

const Shops = mongoose.model("shop", ShopSchema);

const validateShop = (data) => {
  const schema = Joi.object({
    shop_name: Joi.string().required().label("กรุณากรอกชื่อร้าน"),
    shop_status: Joi.boolean().default(true)
  });
  return schema.validate(data);
};

module.exports = {Shops, validateShop};
