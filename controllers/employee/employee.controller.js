const {
  Employees,
  validateEmployee,
} = require("../../models/user/employee.model");
const bcrypt = require("bcrypt");
const dayjs = require("dayjs");

exports.fildAll = async (req, res) => {
  try {
    const employee = await Employees.find();
    if (employee) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลพนักงานสำเร็จ",
        data: employee,
      });
    } else {
      return res.status(404).send({message: "ไม่พบพนักงาน", status: false});
    }
  } catch (err) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.findByShopId = async (req, res) => {
  try {
    const id = req.params.id;
    const employee = await Employees.find({employee_shop_id: id});
    if (employee) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลพนักงานสำเร็จ",
        data: employee,
      });
    } else {
      return res.status(404).send({message: "ไม่พบพนักงาน", status: false});
    }
  } catch (err) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const employee = await Employees.findById(id);
    if (employee) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลพนักงานสำเร็จ",
        data: employee,
      });
    } else {
      return res.status(404).send({message: "ไม่พบพนักงาน", status: false});
    }
  } catch (error) {
    res.status(500).send({
      message: "มีบางอย่างผิดพลาด",
      status: false,
    });
  }
};

exports.create = async (req, res) => {
  try {
    const {error} = validateEmployee(req.body);
    if (error)
      return res
        .status(400)
        .send({message: error.details[0].message, status: false});

    const user = await Employees.findOne({
      employee_username: req.body.employee_username,
    });
    if (user)
      return res.status(409).send({
        status: false,
        message: "มีชื่อผู้ใช้งานนี้ในระบบเเล้ว",
      });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.employee_password, salt);
    const date = dayjs(Date.now()).format("");
    const result = await new Employees({
      ...req.body,
      employee_password: hashPassword,
      employee_date_start: date,
    }).save();
    res
      .status(201)
      .send({message: "สร้างข้อมูลสำเร็จ", status: true, result: result});
  } catch (error) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const employee = await Employees.findByIdAndDelete(id);
    if (!employee) {
      return res
        .status(404)
        .send({status: false, message: "ไม่พบข้อมูลพนักงาน"});
    } else {
      return res
        .status(200)
        .send({status: true, message: "ลบข้อมูลพนักงานสำเร็จ"});
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};

exports.update = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({
        message: "ส่งข้อมูลผิดพลาด",
      });
    }
    const id = req.params.id;
    if (!req.body.employee_password) {
      const employee = await Employees.findByIdAndUpdate(id, req.body);
      if (employee) {
        if (product) {
          return res
            .status(200)
            .send({message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว", status: true});
        } else {
          return res
            .status(500)
            .send({message: "ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้", status: false});
        }
      }
    } else {
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.employee_password, salt);
      const employee = await Employees.findByIdAndUpdate(id, {
        ...req.body,
        employee_password: hashPassword,
      });
      if (employee) {
        return res
          .status(200)
          .send({message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว", status: true});
      } else {
        return res
          .status(500)
          .send({message: "ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้", status: false});
      }
    }
  } catch (error) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};
