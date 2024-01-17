const mongoose = require("mongoose");
const Joi = require("joi");

const ProfitAndLossSchema = new mongoose.Schema({
  product_costs: [
    {
      product_id: { type: String, required: false }, //ไอดีสินค้า
      name: { type: String, required: false },
      total_price_cost: { type: String, required: false },//ราคารวมต้นทุน
      total:{ type: String, required: false },//ราคารวมจากการขาย
      profit_loss:{ type: String, required: false },//ราคาหลังจากหักต้นทุน ได้กำไรขาดทุน
    },
  ],
  status: { type: Boolean, required: false, default: true },
});
const ProditAndLoss = mongoose.model("ProditAndLoss", ProfitAndLossSchema);

module.exports = { ProditAndLoss };
