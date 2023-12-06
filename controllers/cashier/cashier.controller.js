  const {Cashier , validateCashier} = require("../../models/user/cashier.model");
  const bcrypt = require("bcrypt");
  const dayjs = require("dayjs");
  const {PreOrderProducts} = require("../../models/product/preorder.model");
  const {PreOrderProductShell}= require("../../models/product/preordershell.model")
  
  
  exports.create = async (req, res) => {
    try {
        const {error} = validateCashier(req.body);
      if (error)
        return res
          .status(400)
          .send({message: error.details[0].message, status: false});
  
      const user = await Cashier.findOne({
        cashier_username: req.body.cashier_username,
      });
      if (user)
        return res.status(409).send({
          status: false,
          message: "มีชื่อผู้ใช้งานนี้ในระบบเเล้ว",
        });
  
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.cashier_password, salt);
      const date = dayjs(Date.now()).format("");

      const result = await new Cashier({
        ...req.body,
        cashier_password: hashPassword,
        cashier_date_start: date,
      }).save();
      res
        .status(201)
        .send({message: "สร้างข้อมูลสำเร็จ", status: true, result: result});
    } catch (error) {
     res.status(500).send({message: error.message , status: false});
    }
  };

  exports.findOneCashier = async (req, res) => {
    try {
      const id = req.params.id;
      const cashier = await Cashier.findById(id);
      if (cashier) {
        return res.status(200).send({
          status: true,
          message: "ดึงข้อมูลพนักงานสำเร็จ",
          data: cashier,
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

  exports.updateCashier = async (req, res) => {
    try {
      if (!req.body) {
        return res.status(400).send({
          message: "ส่งข้อมูลผิดพลาด",
        });
      }
      const id = req.params.id;
      if (!req.body.cashier_password) {
        const cashier = await Cashier.findByIdAndUpdate(id, req.body);
        if (cashier) {
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
        const hashPassword = await bcrypt.hash(req.body.cashier_password, salt);
        const cashier = await Cashier.findByIdAndUpdate(id, {
          ...req.body,
          cashier_password: hashPassword,
        });
        if (cashier) {
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

  exports.deleteCashier= async (req, res) => {
    try {
      const id = req.params.id;
      const cashier = await Cashier.findByIdAndDelete(id);
      if (!cashier) {
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

  exports.getCashierAll = async (req,res) =>{
    try {
      const cashier = await Cashier.find();
      if (cashier) {
        return res.status(200).send({
          status: true,
          message: "ดึงข้อมูลพนักงานสำเร็จ",
          data: cashier,
        });
      } else {
        return res.status(404).send({message: "ไม่พบพนักงาน", status: false});
      }
    } catch (err) {
      res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
    }
  }

  
  