const mongoose = require("mongoose");
const Joi = require("joi");

const PciceCostSchema = new mongoose.Schema({
  name: { type: String, required: false }, //ชื่อสินค้า
  barcode: { type: String, required: false }, //บาร์โค๊ดสินค้า
  bands: { type: String, required: false }, //ชื่อเเบรน์สินค้า
  size: { type: String, required: false }, //ขนาดของสินค้า
  taste: { type: String, required: false }, //รสชาติของสินค้า
  supplier_id: { type: String }, //คู่ค้า
  quantity: { type: Number, required: false }, //จำนวนสินค้า
  price_cost: { type: Number, required: false }, //ราคาต้นทุน
  product_costs: [
    {
      product_id: { type: String, required: false },
      totalCost: { type: String, required: false },
    },
  ],
  status: { type: Boolean, required: false, default: true },
});
const PciceCost = mongoose.model("PciceCost", PciceCostSchema);

module.exports = { PciceCost };
