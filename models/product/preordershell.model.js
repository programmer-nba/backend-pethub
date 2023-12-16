const Joi = require("joi");
const mongoose = require("mongoose");

const PreOrderShellSchema = new mongoose.Schema({
    shop_id: {type: String, required: true},
    invoice : {type: String, required: true,},
    ordernumbershell : {type :String, required:true},
    employee_name: {type: String, required: true},
    product_detail: {
      type: [
        {
          product_id: {type: String, required: false},
          product_name: {type: String, required: false},
          product_amount: {type: Number, required: false},
          product_price: {type: Number, required: false},
          product_logo: {type: String, required: false},
          barcode: {type: String, required: false},
          price_cost: {type: Number, required: false}, //ราคาต้นทุน //บาร์โค๊ดสินค้า
        },
      ],
    },
    promotion:{type: String, required: false ,default:"" },
    processed: {type: String, required: false,},//ใช้เก็บข้อมูลเลขว่าใช้ซ้ำได้มั้ย
    status: {type: Array, required: false,},
    timestamps: {type: Date, required: false, default: Date.now()},
  });
  
  const PreOrderProductShell = mongoose.model("PreOrderProductShell", PreOrderShellSchema);
  
  module.exports = {PreOrderProductShell};
  