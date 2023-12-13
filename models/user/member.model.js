const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

  const MemberSchema = new mongoose.Schema({
    member_name: {type: String, required: true},
    member_lastname: {type: String, required: true},
    member_phone: {type: String, required: true},
    member_position: {type: String, required: true},
    member_type:{type: String, required: false , default :"ไม่มี"} 
  });
const Member = mongoose.model("member", MemberSchema);
const validatemember = (data) => {
    const schema = Joi.object({
        member_name: Joi.string().required().label("กรุณากรอกชื่อ"),
        member_lastname: Joi.string().required().label("กรุณากรอกนามสกุล"),
        member_phone: Joi.string().required().label("กรอกเบอร์โทรลูกค้า"),
        member_position: Joi.string().required().label("กรอกตำแหน่งที่อยู่"),
        member_type:Joi.string().required().label("กรอกสถานะประเภทลูกค้า"),
    });
    return schema.validate(data);
  };
module.exports = {Member, validatemember};