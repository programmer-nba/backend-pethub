const Joi = require("joi");
const mongoose = require("mongoose");

const ProductShopSchema = new mongoose.Schema({
  product_id: {type: String, required: false},
  shop_id: {type: String, required: false},
  logo:{type: String, required: false},//รูปภาพสินค้า
  name: {type: String, required: false}, //ชื่อสินค้า
  category: {type: String, required: false}, //ประเภทสินค้า
  barcode: {type: String, required: false}, // บาร์โค๊ดสินค้า
  ProductAmount: {type: Number, required: false},
  price_cost: {type: Number, required: false}, //ราคาต้นทุน
  retailprice:
    {
      level1: { type: Number, required: false },
      level2: { type: Number, required: false },
      level3: { type: Number, required: false },
      level4: { type: Number, required: false },
      level5: { type: Number, required: false },
    },//ราคาปลีก
  wholesaleprice:
    {
      level1: { type: Number, required: false },
      level2: { type: Number, required: false },
      level3: { type: Number, required: false },
      level4: { type: Number, required: false },
      level5: { type: Number, required: false },
    },//ราคาส่ง
  memberretailprice:
    {
      level1: { type: Number, required: false },
      level2: { type: Number, required: false },
      level3: { type: Number, required: false },
      level4: { type: Number, required: false },
      level5: { type: Number, required: false },
    },//ราคาปลีกสมาชิก
  memberwholesaleprice:
      {
        level1: { type: Number, required: false },
        level2: { type: Number, required: false },
        level3: { type: Number, required: false },
        level4: { type: Number, required: false },
        level5: { type: Number, required: false },
      },//ราคาส่งสมาชิก
  price: {type: Number, required: false}, //ราคาสินค้า
});

const ProductShops = mongoose.model("product_shop", ProductShopSchema);

const validateProduct = (data) => {
  const schema = Joi.object({
    productShop_id: Joi.string().required(),
    productShop_barcode: Joi.string().default(""),
    productShop_status: Joi.boolean().required(true),
    productShop_stock: Joi.number().default(0),
    productShop_pethub_id: Joi.string().default("ไม่มี"),
  });
  return schema.validate();
};

module.exports = {ProductShops, validateProduct};
