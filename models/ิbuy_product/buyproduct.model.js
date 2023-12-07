const mongoose = require("mongoose");
const Joi = require("joi");

const PreOrderShoppingSchema = new mongoose.Schema({
  poshop_ref_short: { type: String, required: false },
  poshop_ref_full: { type: String, required: false, default: "ไม่มี" },
  poshop_shop_id: { type: String, required: false },
  poshop_detail: { type: Array, required: false, },
  poshop_total: { type: Number, required: false },
  poshop_type_price: { type: String, required: false, default: "เงินสด" },
  poshop_total_price: { type: Number, required: false },
  poshop_discount: { type: Number, required: false, default: 0 },
  poshop_status: { type: Boolean, required: false, default: false },
  poshop_phone: { type: String, required: false, default: "ไม่มี" },
  poshop_timestamp: { type: Date, required: false, default: Date.now() },
  poshop_employee: { type: String, required: false, default: "ไม่มี" },
});

const preorder_shopping = mongoose.model("preorder_shopping", PreOrderShoppingSchema);

module.exports = { preorder_shopping};
