const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const{Member,validatemember} = require("../../models/user/member.model")
const {typeMember} = require("../../models/user/type.model")

exports.create = async (req, res) => {
  try {
    const { error } = validatemember(req.body);

    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: false });
    }

    // ตรวจสอบว่ามีเบอร์โทรที่ซ้ำหรือไม่
    const existingMember = await Member.findOne({
      member_phone: req.body.member_phone,
    });

    if (existingMember) {
      return res.status(409).send({
        message: "เบอร์โทรที่ใช้ลงทะเบียนซ้ำกับข้อมูลที่มีอยู่แล้ว",
        status: false,
      });
    }

    const result = await new Member({
      ...req.body,
      member_name: req.body.member_name,
      member_lastname: req.body.member_lastname,
      member_phone: req.body.member_phone,
      member_position: req.body.member_position,
    }).save();

    res.status(201).send({
      message: "สร้างข้อมูลสำเร็จ",
      status: true,
      result: result,
    });
  } catch (error) {
    res.status(500).send({ message: error.message, status: false });
  }
};

exports.findOneMember = async (req, res) => {
  try {
    const id = req.params.id;
    const member = await Member.findOne({ member_phone: id });
    console.log(member)
    if (member) {

      const type = await typeMember.findById(member.member_type);

      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลลูกค้าสำเร็จ",
        data: member,
      });
    } else {
      return res.status(404).send({ message: "ไม่พบข้อมูลลูกค้า", status: false });
    }
  } catch (error) {
    console.log(error);
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

exports.deleteMember = async (req,res) =>{
  try {
    const id = req.params.id;
    const member = await Member.findByIdAndDelete(id);
    if (!member) {
      return res
        .status(404)
        .send({status: false, message: "ไม่พบข้อมูลลูกค้า"});
    } else {
      return res
        .status(200)
        .send({status: true, message: "ลบข้อมูลลูกค้าสำเร็จ"});
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
}

exports.createTypeMember = async (req, res) => {
  try {
    const typemember = await new typeMember({
      ...req.body,
      typeMember:req.body.typeMember
    }).save();
    res.status(200).send({message: "เพิ่มประเภทสินค้าสำเร็จ", status: true ,  result: typemember});
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};

exports.findTypemember = async (req,res) =>{
  try {
    const member = await typeMember.find();
    if (member) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลประเภทลูกค้าสำเร็จ",
        data: member,
      });
    } else {
      return res.status(404).send({message: "ไม่พบข้อมูลประเภทลูกค้า", status: false});
    }
  } catch (err) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
}

exports.findOneTypeMember = async (req, res) => {
  try {
    const id = req.params.id;
    const type = await typeMember.findOne({ _id: id });
    console.log(type)
    if (type) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลประเภทลูกค้าสำเร็จ",
        data: type,
      });
    } else {
      return res.status(404).send({message: "ไม่พบข้อมูลประเภทลูกค้า", status: false});
    }
  } catch (error) {
    res.status(500).send({
      message: "มีบางอย่างผิดพลาด",
      status: false,
    });
  }
};

exports.updateTypeMember = async (req, res) => {
  try {
    const type = await typeMember.findByIdAndUpdate(req.params.id, req.body);
    if (type) {
      return res
        .status(200)
        .send({message: "แก้ไขข้อมูลประเภทสินค้าสำเร็จ", status: true});
    } else {
      return res
        .status(500)
        .send({message: "แก้ไขข้อมูลประเภทสินค้าไม่สำเร็จ", status: false});
    }
  } catch (err) {

    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};

exports.deleteTypeMember = async (req,res) =>{
  try {
    const id = req.params.id;
    const type = await typeMember.findByIdAndDelete(id);
    if (!type) {
      return res
        .status(404)
        .send({status: false, message: "ไม่พบข้อมูลประเภทสินค้า"});
    } else {
      return res
        .status(200)
        .send({status: true, message: "ลบข้อมูลประเภทลูกค้าสำเร็จ"});
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
}
