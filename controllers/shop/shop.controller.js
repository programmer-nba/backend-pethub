const {Shops, validateShop} = require("../../models/shop/shop.model.js");

exports.create = async (req, res) => {
  try {
    // const {error} = validateShop(req.body);
    // if (error) {
    //   return res
    //     .status(400)
    //     .send({status: false, message: error.details[0].message});
    // }
    const shop = await Shops.findOne({
      shop_name: req.body.shop_name,
    });
    if (shop)
      return res.status(409).send({
        status: false,
        message: "มีชื่อช็อปนี้ในระบบแล้ว",
      });
    await new Shops({
      ...req.body,
    }).save();
    res.status(201).send({message: "เพิ่มข้อมูลช็อปสำเร็จ", status: true});
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};

exports.getShopAll = async (req, res) => {
  try {
    const shop = await Shops.find();
    if (!shop) {
      return res
        .status(404)
        .send({status: false, message: "ไม่พบข้อมูลช็อปในระบบ"});
    } else {
      return res
        .status(200)
        .send({status: true, message: "ดึงข้อมูลสำเร็จ", data: shop});
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};

exports.getShopById = async (req, res) => {
  try {
    const id = req.params.id;
    const shop = await Shops.findById(id);
    if (!shop) {
      return res
        .status(404)
        .send({status: false, message: "ไม่พบข้อมูลช็อปในระบบ"});
    } else {
      return res
        .status(200)
        .send({status: true, message: "ดึงข้อมูลสำเร็จ", data: shop});
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};

exports.updateShop = async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.body) {
      return res
        .status(400)
        .send({status: false, message: error.details[0].message});
    }
    const new_shop = await Shops.findByIdAndUpdate(id, {
      ...req.body,
    });
    if (new_shop) {
      return res.send({
        status: true,
        message: "แก้ไขข้อมูลช็อปเรียบร้อย",
      });
    } else {
      return res.status(400).send({
        status: false,
        message: "ไม่สามารถแก้ไขช็อปนี้ได้",
      });
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};

exports.deleteShop = async (req, res) => {
  try {
    const id = req.params.id;
    const shop = await Shops.findByIdAndDelete(id);
    if (!shop) {
      return res
        .status(404)
        .send({status: false, message: "ไม่พบข้อมูลช็อปในระบบ"});
    } else {
      return res.status(200).send({status: true, message: "ลบข้อช็อปสำเร็จ"});
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};
