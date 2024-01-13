const Joi = require("joi");
const mongoose = require("mongoose");

const LavelSchema = new mongoose.Schema({
    name: {type: String, required: true , default :"ไม่มีระดับของลูกค้า"}, //ชื่อประเภทสินค้า
  
});

const lavels = mongoose.model("lavels", LavelSchema);

const validatelavels = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label("กรุณากรอกระดับของลูกค้า"),
  });
  return schema.validate(data);
};

module.exports = {lavels, validatelavels};
