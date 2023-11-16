const Joi = require("joi");
const mongoose = require("mongoose");

const PreOrderSchema = new mongoose.Schema({
  shop_id: {type: String, required: true},
  shop_name: {type: String, required: true},
  invoice : {type: String, required: false, default: ''},
  employee_name: {type: String, required: true},
  product_detail: {
    type: [
      {
        product_id: {type: String, required: true},
        product_name: {type: String, required: true},
        quantity: {type: Number, required: true},
      },
    ],
  },
  status: {type: Array, required: true},
  timestamps: {type: Date, required: false, default: Date.now()},
});

const PreOrderProducts = mongoose.model("preorder_product", PreOrderSchema);

module.exports = {PreOrderProducts};
