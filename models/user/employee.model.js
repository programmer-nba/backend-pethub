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

const EmployeeSchema = new mongoose.Schema({
  employee_shop_id: {type: String, required: true},
  employee_name: {type: String, required: true},
  employee_username: {type: String, required: true},
  employee_password: {type: String, required: true},
  employee_phone: {type: String, required: true},
  employee_position: {type: String, required: false, default: "employee"},
  employee_role: {type: String, required: false},
  employee_date_start: {type: Date, required: false, default: Date.now()},
});

EmployeeSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.employee_name,
      shop_id: this.employee_shop_id,
      phone: this.employee_phone,
      row: "employee",
    },
    process.env.JWTPRIVATEKEY,
    {
      expiresIn: "4h",
    }
  );
  return token;
};

const Employees = mongoose.model("employee", EmployeeSchema);

const validateEmployee = (data) => {
  const schema = Joi.object({
    employee_shop_id: Joi.string().required().label("กรุณากรอกไอดี Shop ด้วย"),
    employee_name: Joi.string().required().label("กรุณากรอกชื่อพนักงาน"),
    employee_username: Joi.string().required().label("กรูณากรอกไอดีผู้ใช้"),
    employee_password: passwordComplexity(complexityOptions)
      .required()
      .label("ไม่มีข้อมูลรหัสผ่าน"),
    employee_phone: Joi.string().required().label("กรอกเบอร์โทรพนักงาน"),
    employee_position: Joi.string().required().label("กรอกตำแหน่งพนักงาน"),
    employee_role: Joi.string().required().label("กรอกหน้าที่พนักงาน")
  });
  return schema.validate(data);
};

module.exports = {Employees, validateEmployee};
