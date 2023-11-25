const Joi = require("joi");
const mongoose = require("mongoose");

const PreOrderSchema = new mongoose.Schema({
  shop_id: {type: mongoose.Schema.Types.ObjectId,ref:'product'},
  invoice : {type: String, required: false,},
  employee_name: {type: String, required: true},
  product_detail: {
    type: [
      {
        product_id: {type: String, required: false},
        product_name: {type: String, required: false},
        product_image: {type: String, required: false},
        product_const: {type: Number, required: false},
        product_price: {type: Number, required: false},
        product_amount: {type: Number, required: false},
      },
    ],
  },
  status: {type: Array, required: false,},
  timestamps: {type: Date, required: false, default: Date.now()},
});

const PreOrderProducts = mongoose.model("preorder_product", PreOrderSchema);

module.exports = {PreOrderProducts};
