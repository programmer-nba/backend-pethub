const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

  const MemberSchema = new mongoose.Schema({
    member_id: {type: String, required: false},//รหัสสมาชิก
    member_prefix:{type: String, required: false},//คำนำหน้า
    member_name: {type: String, required: true},
    member_lastname: {type: String, required: true},
    member_idcard: {type: Number, required: true},//รหัสบัตรประชาชน
    member_birthday:{type: String, required: true},//วันเกิด
    member_taxnumber:{type: String, required: false},//เลขที่ภาษี
    member_email:{type: String, required: false},
    member_expirationdate:{type: String, required: false, default:"-"},//วันหมดอายุ
    member_phone: {type: String, required: true},
    member_position: {type: String, required: true},
    member_note: {type: String, default:"ไม่มี"},//หมายเหตุ
    member_createdby:{type: String, required: false},//สร้างโดย
    member_type:{type: String, required: false , default :"ไม่มี"} 

  });
const Member = mongoose.model("member", MemberSchema);
const validatemember = (data) => {
    const schema = Joi.object({
        member_name: Joi.string().required().label("กรุณากรอกชื่อ"),
        member_lastname: Joi.string().required().label("กรุณากรอกนามสกุล"),
        member_phone: Joi.string().required().label("กรอกเบอร์โทรลูกค้า"),
        member_position: Joi.string().required().label("กรอกตำแหน่งที่อยู่"),
        member_idcard: Joi.string().required().label("กรอกเลขบัตรประชาชน"),
        member_birthday: Joi.string().required().label("กรอกวันเดือนปีเกิด"),
        member_email: Joi.string().required().label("กรอกอีเมล์"),
        member_type:Joi.string().required().label("กรอกสถานะประเภทลูกค้า"),
    });
    if ('member_note' in data) {
      delete data.member_note;
    }
    return schema.validate(data);
  };
module.exports = {Member, validatemember};