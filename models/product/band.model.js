const Joi = require("joi");
const mongoose = require("mongoose");

const BandSchema = new mongoose.Schema({
  name: {type: String, required: true , default :"ไม่มีเเบรน์ตัวนี้"}, //ชื่อประเภทสินค้า
  
});

const Bands = mongoose.model("band", BandSchema);

const validateband = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label("กรุณากรอกชื่อเเบรน์"),
  });
  return schema.validate(data);
};

module.exports = {Bands, validateband};
