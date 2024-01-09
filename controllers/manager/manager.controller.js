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