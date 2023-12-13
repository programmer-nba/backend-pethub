const mongoose = require("mongoose");
const Joi = require("joi");

const TypeSchema = new mongoose.Schema({
    typeMember: {type: String, required: false }, //ตัวอย่าง ลูกค้าที่ใช้งานไม่บ่อย //ลูกค้าประจำ
  

  });



const typeMember = mongoose.model("typeMember", TypeSchema);
module.exports = {typeMember};