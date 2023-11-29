const Joi = require("joi");
const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {type: String, required: true}, //ชื่อประเภทสินค้า
  
});

const Categorys = mongoose.model("category", CategorySchema);

const validatecategory = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label("กรุณากรอกชื่อประเภทสินค้า"),
  });
  return schema.validate(data);
};

module.exports = {Categorys, validatecategory};
