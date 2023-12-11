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

      const result = await new Member({
        ...req.body,
        member_name:req.body.member_name,
        member_lastname:req.body.member_lastname,
        member_phone:req.body.member_phone,
        member_position:req.body.member_position
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

exports.updateMember = async (req, res) => {
    try {
      const id = req.params.id;
      if (!req.body) {
        return res
          .status(400)
          .send({status: false, message: error.details[0].message});
      }
      if (!req.body.admin_password) {
        const member_new = await Member.findByIdAndUpdate(id, req.body);
        if (!member_new) {
          return res
            .status(400)
            .send({status: false, message: "ไม่สามารถแก้ไขผู้ใช้งานนี้ได้"});
        } else {
          return res.send({
            status: true,
            message: "แก้ไขข้อมูลผู้ใช้งานเรียบร้อย",
          });
        }
      } else {
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.admin_password, salt);
        const new_password = await Member.findByIdAndUpdate(id, {
          ...req.body,
          admin_password: hashPassword,
        });
        if (!new_password) {
          return res.status(400).send({
            status: false,
            message: "ไม่สามารถแก้ไขรหัสผ่านผู้ใช้งานนี้ได้",
          });
        } else {
          return res.send({
            status: true,
            message: "แก้ไขข้อมูลผู้ใช้งานเรียบร้อย",
          });
        }
      }
    } catch (err) {
      return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
    }
  };