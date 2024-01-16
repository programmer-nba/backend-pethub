const mongoose = require("mongoose");
const Joi = require("joi");

const PreOrderShoppingSchema = new mongoose.Schema({
  invoiceShoppingNumber:{type: String, required: true },
  customer_shop_id: { type: String, required: false },
  customer_name:{ type: String, required: false},
  customer_phone: { type: String, required: false },
  customer_detail: { type: Array, required: false, },
  total: { type: Number, required: false ,default: 0  },
  nameproduct:{ type: String, required: false },
  // poshop_type_price: { type: String, required: false, default: "เงินสด" },
  price_cost :{type: Number, required: false,},//ราคาต้นทุน ต่อชิ้น
  total_price_cost:[
    {
      product_id: { type: String, required: false },//ไอดีของสินค้า
      totalPriceCost: { type: Number, default: 0 },//ราคารวมต้นทุนของสินค้า
      totalNet:{ type: Number, default: 0},//ราคารวมสุทธิ์
    }
  ],//ราคาต้นทุนทั้งหมดต่อบิล
  discount: { type: Number, required: false, default: 0 },
  net:{ type: Number, required: false , default: 0  },
  customer_status: { type: Boolean, required: false, default: false },
  timestamp: { type: Date, required: false, default: Date.now() },
  employee: { type: String, required: false, default: "ไม่มี" },
});

const preorder_shopping = mongoose.model("preorder_shopping", PreOrderShoppingSchema);

module.exports = { preorder_shopping};
