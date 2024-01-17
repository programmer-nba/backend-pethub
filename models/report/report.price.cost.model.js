const mongoose = require("mongoose");
const Joi = require("joi");

const PciceCostSchema = new mongoose.Schema({
  product_costs: [
    {
      product_id: { type: String, required: false },
      name: { type: String, required: false },
      total_price_cost: { type: String, required: false },
    },
  ],
  status: { type: Boolean, required: false, default: true },
});
const PciceCost = mongoose.model("PciceCost", PciceCostSchema);

module.exports = { PciceCost };
