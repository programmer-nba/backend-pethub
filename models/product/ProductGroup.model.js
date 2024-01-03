const Joi = require("joi");
const mongoose = require("mongoose");

const productgroupSchema = new mongoose.Schema({
  name: {type: String, required: false , default :"0"}, //ชื่อประเภทสินค้า
  
});

const ProductGroup = mongoose.model("ProductGroup", productgroupSchema);

const validateProductGroup = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label("กรุณากรอกขนาดของสินค้า"),
  });
  return schema.validate(data);
};

module.exports = {ProductGroup, validateProductGroup};
