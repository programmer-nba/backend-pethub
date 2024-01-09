const bcrypt = require("bcrypt");
const {Manager,validateManager} = require("../../models/user/manager.model")
const dayjs = require("dayjs");




exports.create = async (req, res) => {
    try {
      const {error} = validateManager(req.body);
      if (error) {
        return res
          .status(400)
          .send({status: false, message: error.details[0].message});
      }
      const user = await Manager.findOne({
        manager_username: req.body.manager_username,
      });
      if (user) {
        return res.status(400).send({
          status: false,
          message: "มีชื่อผู้ใช้งานนี้ในระบบเเล้ว",
        });
      } else {
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.manager_password, salt);
        await new Manager({
          ...req.body,
          manager_password: hashPassword,
        }).save();
        return res.status(200).send({message: "สร้างข้อมูลสำเร็จ", status: true});
      }
    } catch (err) {
      return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
    }
  };

exports.fildManagerAll = async (req, res) => {
    try {
      const manager = await Manager.find();
      if (manager) {
        return res.status(200).send({
          status: true,
          message: "ดึงข้อมูลผู้จัดการสำเร็จ",
          data: manager,
        });
      } else {
        return res.status(404).send({message: "ไม่พบผู้จัดการ", status: false});
      }
    } catch (err) {
      res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
    }
  };

exports.fildManagerOne = async (req, res) => {
    try {
      const id = req.params.id
      const manager = await Manager.findById(id);
      if (manager) {
        return res.status(200).send({
          status: true,
          message: "ดึงข้อมูลผู้จัดการสำเร็จ",
          data: manager,
        });
      } else {
        return res.status(404).send({message: "ไม่พบผู้จัดการ", status: false});
      }
    } catch (err) {
      res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
    }
  };

  exports.updateManager = async (req, res) => {
    try {
      if (!req.body) {
        return res.status(400).send({
          message: "ส่งข้อมูลผิดพลาด",
        });
      }
      const id = req.params.id;
      if (!req.body.manager_password) {
        const manager = await Manager.findByIdAndUpdate(id, req.body);
        if (manager) {
          if (manager) {
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
        const hashPassword = await bcrypt.hash(req.body.manager_password, salt);
        const manager = await Manager.findByIdAndUpdate(id, {
          ...req.body,
          manager_password: hashPassword,
        });
        if (manager) {
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

  exports.deleteManager = async (req, res) => {
    try {
      const id = req.params.id;
      const manager = await Manager.findByIdAndDelete(id);
      if (!manager) {
        return res
          .status(404)
          .send({status: false, message: "ไม่พบข้อมูลผู้จัดการ"});
      } else {
        return res
          .status(200)
          .send({status: true, message: "ลบข้อมูลผู้จัดการสำเร็จ"});
      }
    } catch (err) {
      return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
    }
  };