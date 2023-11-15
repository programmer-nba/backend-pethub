const {Admins, validateAdmin} = require("../../models/user/admin.model");
const bcrypt = require("bcrypt");

exports.create = async (req, res) => {
  try {
    const {error} = validateAdmin(req.body);
    if (error) {
      return res
        .status(400)
        .send({status: false, message: error.details[0].message});
    }
    const user = await Admins.findOne({
      admin_username: req.body.admin_username,
    });
    if (user)
      return res.status(400).send({
        status: false,
        message: "มีชื่อผู้ใช้งานนี้ในระบบเเล้ว",
      });
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.admin_password, salt);
    await new Admins({
      ...req.body,
      admin_password: hashPassword,
    }).save();
    res.status(200).send({message: "สร้างข้อมูลสำเร็จ", status: true});
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};

exports.getAdminAll = async (req, res) => {
  try {
    const admin = await Admins.find();
    if (!admin) {
      return res
        .status(404)
        .send({status: false, message: "ไม่พบผู้ใช้งานในระบบ"});
    } else {
      return res
        .status(200)
        .send({status: true, message: "ดึงข้อมูลสำเร็จ", data: admin});
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};

exports.getAdminById = async (req, res) => {
  try {
    const id = req.params.id;
    const admin = await Admins.findById(id);
    if (!admin) {
      return res
        .status(404)
        .send({status: false, message: "ไม่พบผู้ใช้งานในระบบ"});
    } else {
      return res
        .status(200)
        .send({status: true, message: "ดึงข้อมูลสำเร็จ", data: admin});
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.body) {
      return res
        .status(400)
        .send({status: false, message: error.details[0].message});
    }
    if (!req.body.admin_password) {
      const admin_new = await Admins.findByIdAndUpdate(id, req.body);
      if (!admin_new) {
        return res.status(400).send({status: false, message: "ไม่สามารถแก้ไขผู้ใช้งานนี้ได้"})
      } else {
        return res.send({status: true, message: "แก้ไขข้อมูลผู้ใช้งานเรียบร้อย"})
      }
    } else {
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.admin_password, salt);
      const new_password = await Admins.findByIdAndUpdate(
        id,
        { ...req.body, admin_password: hashPassword}
      )
      if (!new_password) {
        return res.status(400).send({status: false, message: "ไม่สามารถแก้ไขรหัสผ่านผู้ใช้งานนี้ได้"})
      } else {
        return res.send({status: true, message: "แก้ไขข้อมูลผู้ใช้งานเรียบร้อย"})
      }
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const admin = await Admins.findByIdAndDelete(id);
    if (!admin) {
      return res
        .status(404)
        .send({status: false, message: "ไม่พบผู้ใช้งานในระบบ"});
    } else {
      return res.status(200).send({status: true, message: "ลบข้อผู้ใช้สำเร็จ"});
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};
