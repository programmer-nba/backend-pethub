const {Admins, validateAdmin} = require("../../models/user/admin.model");
const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const {Member}= require("../../models/user/member.model")
const {typeMember} = require("../../models/user/type.model")
const {PackProducts} = require("../../models/product/productpack.model")
const {Products} = require("../../models/product/product.model")
const {ReturnProduct} = require("../../models/product/return.product.model")
const {ReturnProductShall} = require("../../models/product/return.product.shell.model")
const {ProductShall} = require("../../models/product/product.shall.model")
const {lavels,validatelavels} = require("../../models/product/level.model")

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
    if (user) {
      return res.status(400).send({
        status: false,
        message: "มีชื่อผู้ใช้งานนี้ในระบบเเล้ว",
      });
    } else {
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.admin_password, salt);
      await new Admins({
        ...req.body,
        admin_password: hashPassword,
      }).save();
      return res.status(200).send({message: "สร้างข้อมูลสำเร็จ", status: true});
    }
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
      const new_password = await Admins.findByIdAndUpdate(id, {
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

exports.getMemberById = async (req, res) => {
  try {
    const id = req.params.id;
    const member = await Member.findOne({ member_phone: id });
    console.log(member)
    if (member) {

      const type = await typeMember.findById(member.member_type);

      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลลูกค้าสำเร็จ",
        data: member
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

exports.getMemberByAll = async (req, res) => {
  try {
    const member = await Member.find();
    if (member) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลลูกค้าสำเร็จ",
        data: member,
      });
    } else {
      return res.status(404).send({message: "ไม่พบข้อมูลลูกค้า", status: false});
    }
  } catch (err) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};
exports.DeletPackAndOne = async (req,res) =>{
  try {
    const id = req.params.id;
    const packProduct = await Products.findByIdAndDelete(id);
    if (!packProduct) {
      return res.status(404).send({
        status: false,
        message: "ไม่พบสินค้า"
      });
    }
    const product_id = packProduct.product_id;
    const packProductsToDelete = await PackProducts.find({ product_id: packProduct.product_id });
    for (const packProductToDelete of packProductsToDelete) {
      await PackProducts.findByIdAndDelete(packProductToDelete._id);
    }
    if (!packProductsToDelete) {
      return res.status(404).send({
        status: false,
        message: "ไม่พบสินค้าแบบเป็นแพ็ค"
      });
    }
    return res.status(200).send({
      status: true,
      message: "ลบข้อมูลสินค้าเป็นสินเเละเป็นเเพ็คสำเร็จ"
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: "มีบางอย่างผิดพลาด"
    });
  }
}

exports.confirmRTProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const updateStatus = await ReturnProduct.findOne({_id: id});
    console.log(updateStatus);
    if (updateStatus) {
      updateStatus.status.push({
        name: "ยืนยันการส่งสินค้าคืน",
        timestamps: dayjs(Date.now()).format(""),
      });
      updateStatus.save();
      return res.status(200).send({
        status: true,
        message: "ส่งสืนค้าคืนสำเร็จ",
        data: updateStatus,
      });
    } else {
      return res.status(500).send({
        message: "มีบางอย่างผิดพลาด",
        status: false,
      });
    }
  } catch (error) {
    return res.status(500).send({message: error.message, status: false});
  }
};

exports.fildAllProductReturnAdmin = async (req, res) => {
  try {
    const admin = await ReturnProduct.find();
    console.log(admin)
    if (admin) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลรายการส่งคืนสินค้าสำเร็จ",
        data: admin,
      });
    } else {
      return res.status(404).send({message: "ไม่พบรายการส่งคืนสินค้า", status: false});
    }
  } catch (err) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};
exports.fildOneProductReturnAdmin = async (req, res) => {
  try {
    const id = req.params.id
    const admin = await ReturnProduct.findById(id);
    if (admin) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลรายการส่งคืนสินค้าสำเร็จ",
        data: admin,
      });
    } else {
      return res.status(404).send({message: "ไม่พบรายการส่งคืนสินค้า", status: false});
    }
  } catch (err) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.fildAllProductReturnShallAdmin = async (req, res) => {
  try {
    const admin = await ReturnProductShall.find();
    console.log(admin)
    if (admin) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลรายการส่งคืนสินค้าสำเร็จ",
        data: admin,
      });
    } else {
      return res.status(404).send({message: "ไม่พบรายการส่งคืนสินค้า", status: false});
    }
  } catch (err) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};
exports.fildOneProductReturnShallAdmin = async (req, res) => {
  try {
    const id = req.params.id
    const admin = await ReturnProductShall.findById(id);
    if (admin) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลรายการส่งคืนสินค้าสำเร็จ",
        data: admin,
      });
    } else {
      return res.status(404).send({message: "ไม่พบรายการส่งคืนสินค้า", status: false});
    }
  } catch (err) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.fildProductShell = async(req,res)=>{
  try {
    const shop_id = req.params.shop_id
    const shell = await ProductShall.find({shop_id:shop_id});
    console.log(shop_id)
    if (shell) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลสินค้าจากคลังเซลฟ์สำเร็จ",
        data: shell,
      });
    } else {
      return res.status(404).send({message: "ไม่พบสินค้าจากเชลฟ์", status: false});
    }
  } catch (err) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
}
exports.createLevel = async (req, res) => {
  try {
    const {error} = validatelavels(req.body);
    if (error) {
      return res
        .status(400)
        .send({status: false, message: error.details[0].message});
    }
    const data =   await new lavels({
      name: req.body.name,
    }).save();
    res.status(200).send({message: "เพิ่มระดับของพนักงานสำเร็จ", status: true , data:data});
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};
exports.getLevelByAll = async (req, res) => {
  try {
    const level = await lavels.find();
    if (level) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลละดับผู้ใช้งานสำเร็จ",
        data: level,
      });
    } else {
      return res.status(404).send({message: "ไม่พบข้อมูลระดับผู้ใช้งาน", status: false});
    }
  } catch (err) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};
exports.getLevelByID = async (req, res) => {
  console.log("test")
  try {
    const id = req.params.id
    const level = await lavels.findById(id);
    if (level) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลละดับผู้ใช้งานสำเร็จ",
        data: level,
      });
    } else {
      return res.status(404).send({message: "ไม่พบข้อมูลระดับผู้ใช้งาน", status: false});
    }
  } catch (err) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};
exports.deleteLevel = async (req, res) => {
  try {
    const id = req.params.id;
    const level = await lavels.findByIdAndDelete(id);
    if (!level) {
      return res
        .status(404)
        .send({status: false, message: "ไม่พบระดับของผู้ใช้ในระบบ"});
    } else {
      return res.status(200).send({status: true, message: "ลบข้อผู้ระดับของผู้ใช้งานสำเร็จ"});
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};
exports.updateLevelById = async (req, res) => {
  try {
    // const {error} = validateproduct(req.body);
    // if (error) {
    //   return res
    //     .status(400)
    //     .send({status: false, message: error.details[0].message});
    // }
    const level = await lavels.findByIdAndUpdate(req.params.id, req.body);
    if (level) {
      return res
        .status(200)
        .send({message: "แก้ไขข้อมูลระดับของผู้ใช้สำเร็จ", status: true});
    } else {
      return res
        .status(500)
        .send({message: "แก้ไขข้อมูลระดับของผู้ใช้ไม่สำเร็จ", status: false});
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};