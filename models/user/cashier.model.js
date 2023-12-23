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

const CashierSchema = new mongoose.Schema({
    cashier_shop_id: {type: String, required: false},
    cashier_name: {type: String, required: true},
    cashier_username: {type: String, required: true},
    cashier_password: {type: String, required: true},
    cashier_phone: {type: String, required: true},
    cashier_position: {type: String, required: false, default: "cashier"},
    // cashier_role: {type: String, required: false},
    cashier_date_start: {type: Date, required: false, default: Date.now()},
});

CashierSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.cashier_name,
      shop_id: this.cashier_shop_id,
      phone: this.cashier_phone,
      row: "cashier",
    },
    process.env.JWTPRIVATEKEY,
    {
      expiresIn: "4h",
    }
  );
  return token;
  
};

const Cashier = mongoose.model("cashier", CashierSchema);

const validateCashier = (data) => {
  const schema = Joi.object({
    cashier_shop_id: Joi.string().required().label("กรุณากรอกไอดี  ด้วย"),
    cashier_name: Joi.string().required().label("กรุณากรอกชื่อพนักงาน"),
    cashier_username: Joi.string().required().label("กรูณากรอกไอดีผู้ใช้"),
    cashier_password: passwordComplexity(complexityOptions)
      .required()
      .label("ไม่มีข้อมูลรหัสผ่าน"),
    cashier_phone: Joi.string().required().label("กรอกเบอร์โทรพนักงาน"),
    cashier_position: Joi.string().required().label("กรอกตำแหน่งพนักงาน"),
    // cashier_role: Joi.string().required().label("กรอกหน้าที่พนักงาน")
  });
  return schema.validate(data);
};

module.exports = {Cashier, validateCashier};
