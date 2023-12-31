const router = require("express").Router();
const bcrypt = require("bcrypt");
const authMe = require("../lib/auth.me.js");
require("dotenv").config();
const {Admins} = require("../models/user/admin.model.js");
const {Employees} = require("../models/user/employee.model.js");
const {Shops} = require("../models/shop/shop.model.js");
const {Cashier} = require("../models/user/cashier.model.js")
const {Member} = require("../models/user/member.model.js")

router.post("/login", async (req, res) => {
  try {
    const admin = await Admins.findOne({
      admin_username: req.body.username,
    });
    if (!admin) {
      await Promise.all([checkEmployee(req, res), checkCashier(req, res) ]);
    } 
    else {
      const validPasswordAdmin = await bcrypt.compare(
        req.body.password,
        admin.admin_password
      );
      if (!validPasswordAdmin) {
        return res.status(401).send({
          status: false,
          message: "password is not find",
        });
      }
      const token = admin.generateAuthToken();
      const ResponesData = {
        name: admin.admin_name,
        username: admin.admin_username,
        position: admin.admin_position,
      };
      if (token) {
        return res.status(200).send({
          status: true,
          token: token,
          message: "เข้าสู่ระบบสำเร็จ",
          result: ResponesData,
          level: "admin",
        });
      } else {
        return res.status(401).send({
          status: false,
          message: "เข้าสู่ระบบไม่สำเร็จ",
        });
      }
    }
  } catch (err) {
    return res
      .status(500)
      .send({status: false, message: "Internal Server Error"});
  }
});

router.get("/me", authMe, async (req, res) => {
  try {
    const {decoded} = req;
    if (decoded && decoded.row === "admin") {
      const id = decoded._id;
      const admin = await Admins.findOne({_id: id});
      if (!admin) {
        return res
          .status(400)
          .send({message: "มีบางอย่างผิดพลาด", status: false});
      } else {
        return res.status(200).send({
          name: admin.admin_name,
          username: admin.admin_username,
          position: "admin",
          level: admin.admin_position,
        });
      }
    }
    if (decoded && decoded.row === "employee") {
      const id = decoded._id;
      const employee = await Employees.findOne({_id: id});
      if (!employee) {
        return res
          .status(400)
          .send({message: "มีบางอย่างผิดพลาด", status: false});
      } else {
        return res.status(200).send({
          shop_id: employee.employee_shop_id,
          name: employee.employee_name,
          username: employee.employee_username,
          position: employee.employee_position,
          level: employee.employee_role,
        });
      }
      employee;
    }
    if (decoded && decoded.row === "cashier") {
      const id = decoded._id;
      const cashier = await Cashier.findOne({_id: id});
      if (!cashier) {
        return res
          .status(400)
          .send({message: "มีบางอย่างผิดพลาด", status: false});
      } else {
        return res.status(200).send({
          shop_id:cashier.cashier_shop_id,
          name: cashier.cashier_name,
          username: cashier.cashier_username,
          position: cashier.cashier_position,
          level: cashier.cashier_role,
        });
      }
      cashier;
    }
    
  } catch (error) {
    res.status(500).send({message: "Internal Server Error", status: false});
  }
});

const checkEmployee = async (req, res) => {
  try {
    const employee = await Employees.findOne({
      employee_username: req.body.username,
    });
    if (!employee) {
      console.log("ไม่พบข้อมูลพนักงาน shop");
    } else {
      const validPasswordAdmin = await bcrypt.compare(
        req.body.password,
        employee.employee_password
      );
      if (!validPasswordAdmin) {
        // รหัสไม่ตรง
        return res.status(401).send({
          message: "password is not find",
          status: false,
        });
      } else {
        const token = employee.generateAuthToken();
        const ResponesData = {
          name: employee.employee_name,
          username: employee.employee_username,
          shop_id: employee.employee_shop_id,
        };
        return res.status(200).send({
          status: true,
          token: token,
          message: "เข้าสู่ระบบสำเร็จ",
          result: ResponesData,
          level: "employee",
          position: employee.employee_role,
        });
      }
    }
  } catch (error) {
    res.status(500).send({message: "Internal Server Error", status: false});
  }
};


const checkCashier = async (req, res) => {
  try {
    const cashier = await Cashier.findOne({
      cashier_username: req.body.username,
    });
    if (!cashier) {
      console.log("ไม่พบข้อมูลพนักงาน เเคชเชียร์");
    } else {
      const validPasswordAdmin = await bcrypt.compare(
        req.body.password,
        cashier.cashier_password
      );
      if (!validPasswordAdmin) {
        // รหัสไม่ตรง
        return res.status(401).send({
          message: "password is not find",
          status: false,
        });
      } else {
        const token = cashier.generateAuthToken();
        const ResponesData = {
          name: cashier.cashier_name,
          username: cashier.cashier_username,
          // shop_id: cashier.cashier_shop_id,
        };
        return res.status(200).send({
          status: true,
          token: token,
          message: "เข้าสู่ระบบสำเร็จ",
          result: ResponesData,
          level: "cashier",
          position: cashier.cashier_role,
        });
      }
    }
  } catch (error) {
    res.status(500).send({message: "Internal Server Error", status: false});
  }
};

//ไม่ใช้งานเเล้ว
// const checkMember = async (req,res)=>{
//   try {
//     const member = await Member.findOne({
//       member_username: req.body.username,
//     });
//     if (!member) {
//       console.log("ไม่พบข้อมูลลูกค้า");
//     } else {
//       const validatemember = await bcrypt.compare(
//         req.body.password,
//         member.member_password
//       );
//       if (!validatemember) {
//         // รหัสไม่ตรง
//         return res.status(401).send({
//           message: "password is not find",
//           status: false,
//         });
//       } else {
//         const token = member.generateAuthToken();
//         const ResponesData = {
//           name: member.member_name,
//           username: member.member_username,
//           // shop_id: cashier.cashier_shop_id,
//         };
//         return res.status(200).send({
//           status: true,
//           token: token,
//           message: "เข้าสู่ระบบสำเร็จ",
//           result: ResponesData,
//           level: "Member",
//         });
//       }
//     }
//   } catch (error) {
//     res.status(500).send({message: "Internal Server Error", status: false});
//   }

// }




module.exports = router;
