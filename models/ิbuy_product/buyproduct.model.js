const mongoose = require("mongoose");
const Joi = require("joi");

const PreOrderShoppingSchema = new mongoose.Schema({
  customier_id:{ type: String, required: false },
  customer_shop_id: { type: String, required: false },
  customer_name:{ type: String, required: false},
  customer_phone: { type: String, required: false },
  customer_detail: { type: Array, required: false, },
  customer_total: { type: Number, required: false },
  // poshop_type_price: { type: String, required: false, default: "เงินสด" },
  customer_discountdetails:{ type: Number, required: false },
  customer_discount: { type: Number, required: false, default: 0 },
  customer_status: { type: Boolean, required: false, default: false },
  customer_timestamp: { type: Date, required: false, default: Date.now() },
  customer_employee: { type: String, required: false, default: "ไม่มี" },
});

const preorder_shopping = mongoose.model("preorder_shopping", PreOrderShoppingSchema);

module.exports = { preorder_shopping};
