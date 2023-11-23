const Joi = require("joi");
const mongoose = require("mongoose");

const ProductShopSchema = new mongoose.Schema({
  shop_id: {type: String, required: true},
 
  products: [],
  
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
}

module.exports = { ProductShops, validateProduct };
