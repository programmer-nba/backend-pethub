const mongoose = require("mongoose");
const Joi = require("joi");

const PreOrderShoppingSchema = new mongoose.Schema({
  invoiceShoppingNumber:{type: String, required: true },
  customer_shop_id: { type: String, required: false },
  customer_name:{ type: String, required: false},
  customer_phone: { type: String, required: false },
  customer_detail: { type: Array, required: false, },
  total: { type: Number, required: false },
  // poshop_type_price: { type: String, required: false, default: "เงินสด" },
  discount: { type: Number, required: false, default: 0 },
  net:{ type: Number, required: false },
  customer_status: { type: Boolean, required: false, default: false },
  timestamp: { type: Date, required: false, default: Date.now() },
  employee: { type: String, required: false, default: "ไม่มี" },
});

const preorder_shopping = mongoose.model("preorder_shopping", PreOrderShoppingSchema);

module.exports = { preorder_shopping};
