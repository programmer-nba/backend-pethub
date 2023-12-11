const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const complexityOptions = {
    min: 6,
    max: 30,
    lowerCase: 0,
    upperCase: 0,
    numeric: 0,
    symbol: 0,
    requirementCount: 2,
  };
  
  const MemberSchema = new mongoose.Schema({
    member_name: {type: String, required: true},
    member_lastname: {type: String, required: true},
    member_username: {type: String, required: true},
    member_password: {type: String, required: true},
    member_phone: {type: String, required: true},
    member_position: {type: String, required: true},
    employee_date_start: {type: Date, required: false, default: Date.now()},
  });
  
  MemberSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
      {
        _id: this._id,
        name: this. member_name,
        phone: this. member_phone,
        row: "Member",
      },
      process.env.JWTPRIVATEKEY,
      {
        expiresIn: "4h",
      }
    );
    return token;
  };
const Member = mongoose.model("member", MemberSchema);
const validatemember = (data) => {
    const schema = Joi.object({
        member_name: Joi.string().required().label("กรุณากรอกชื่อ"),
        member_lastname: Joi.string().required().label("กรุณากรอกนามสกุล"),
        member_username: Joi.string().required().label("กรูณากรอกไอดีผู้ใช้"),
        member_password: passwordComplexity(complexityOptions)
        .required()
        .label("ไม่มีข้อมูลรหัสผ่าน"),
        member_phone: Joi.string().required().label("กรอกเบอร์โทรลูกค้า"),
        member_position: Joi.string().required().label("กรอกตำแหน่งที่อยู่"),
    });
    return schema.validate(data);
  };
module.exports = {Member, validatemember};