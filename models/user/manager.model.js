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

const ManagerSchema = new mongoose.Schema({
  manager_name: {type: String, required: true}, //ชื่อ
  manager_username: {type: String, required: true}, //เลขบัตร
  manager_password: {type: String, required: true}, //รหัส
  manager_position: {type: String, required: true},
});

ManagerSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {_id: this._id, name: this.manager_name, row: "manager"},
    process.env.JWTPRIVATEKEY,
    {
      expiresIn: "4h",
    }
  );
  return token;
};

const Manager = mongoose.model("manager", ManagerSchema);

const validateManager = (data) => {
  const schema = Joi.object({
    manager_name: Joi.string().required().label("กรุณากรอกชื่อผู้ใช้ด้วย"),
    manager_username: Joi.string().required().label("กรุณากรอกเลขบัตรผู้ใช้ด้วย"),
    manager_password: passwordComplexity(complexityOptions)
      .required()
      .label("admin_password"),
    manager_position: Joi.string().required().label("กรุณากรอกเลเวลผู้ใช้ด้วย"),
  });
  return schema.validate(data);
};

module.exports = {Manager, validateManager};
