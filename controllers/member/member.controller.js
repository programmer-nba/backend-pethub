const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const{Member,validatemember} = require("../../models/user/member.model")

exports.create = async (req, res) => {
    try {
        const {error} = validatemember(req.body);
      if (error)
        return res
          .status(400)
          .send({message: error.details[0].message, status: false});
  
      const user = await Member.findOne({
        member_username: req.body.member_username,
      });
      if (user)
        return res.status(409).send({
          status: false,
          message: "มีชื่อผู้ใช้งานนี้ในระบบเเล้ว",
        });
  
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.member_password, salt);
      const date = dayjs(Date.now()).format("");

      const result = await new Member({
        ...req.body,
        member_password: hashPassword,
        member_date_start: date,
      }).save();
      res
        .status(201)
        .send({message: "สร้างข้อมูลสำเร็จ", status: true, result: result});
    } catch (error) {
     res.status(500).send({message: error.message , status: false});
    }
  };

exports.findOneMember = async (req, res) => {
    try {
      const id = req.params.id;
      const member = await Member.findOne({ member_phone: id });
      console.log(member)
      if (member) {
        return res.status(200).send({
          status: true,
          message: "ดึงข้อมูลลูกค้าสำเร็จสำเร็จ",
          data: member,
        });
      } else {
        return res.status(404).send({message: "ไม่พบข้อมูลลูกค้า", status: false});
      }
    } catch (error) {
      res.status(500).send({
        message: "มีบางอย่างผิดพลาด",
        status: false,
      });
    }
  };