const mongoose = require("mongoose");
const Joi = require("joi");

const PreOrderShoppingSchema = new mongoose.Schema({
  customer_shop_id: { type: String, required: false },
  customer_name:{ type: String, required: false},
  customer_phone: { type: String, required: false },
  customer_address:{ type: String, required: false},
  customer_detail: { type: Array, required: false, },
  customer_total: { type: Number, required: false },
  // poshop_type_price: { type: String, required: false, default: "เงินสด" },
  customer_total_price: { type: Number, required: false },
  customer_discountname:{ type: String, required: false, default: "ไม่มี" },
  customer_discountdetail:{ type: String, required: false, default: "ไม่มีรายละเอียด" },
  customer_discount: { type: Number, required: false, default: 0 },
  customer_status: { type: Boolean, required: false, default: false },
  customer_timestamp: { type: Date, required: false, default: Date.now() },
  customer_employee: { type: String, required: false, default: "ไม่มี" },
});

const preorder_shopping = mongoose.model("preorder_shopping", PreOrderShoppingSchema);

module.exports = { preorder_shopping};
