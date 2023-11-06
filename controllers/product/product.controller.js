const {
  Products,
  validateproduct,
} = require("../../models/product/product.model.js");

exports.create = async (req, res) => {
  try {
    const {error} = validateproduct(req.body);
    if (error) {
      return res
        .status(400)
        .send({status: false, message: error.details[0].message});
    }
    await new Products({...req.body}).save();
    res.status(200).send({message: "เพิ่มข้อมูลสินค้าสำเร็จ", status: true});
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};

exports.getProductAll = async (req, res) => {
  try {
    const product = await Products.find();
    if (product) {
      return res
        .status(200)
        .send({message: "ดึงข้อมูลสินค้าสำเร็จ", status: true, data: product});
    } else {
      return res
        .status(500)
        .send({message: "ดึงข้อมูลสินค้าไม่สำเร็จ", status: false});
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Products.findOne({_id: req.params.id});
    if (product) {
      return res
        .status(200)
        .send({message: "ดึงข้อมูลสินค้าสำเร็จ", status: true, data: product});
    } else {
      return res
        .status(500)
        .send({message: "ดึงข้อมูลสินค้าไม่สำเร็จ", status: false});
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};

exports.updateProduct = async (req, res) => {
  try {
    // const {error} = validateproduct(req.body);
    // if (error) {
    //   return res
    //     .status(400)
    //     .send({status: false, message: error.details[0].message});
    // }
    const product = await Products.findByIdAndUpdate(req.params.id, req.body);
    if (product) {
      return res
        .status(200)
        .send({message: "แก้ไขข้อมูลสินค้าสำเร็จ", status: true});
    } else {
      return res
        .status(500)
        .send({message: "แก้ไขข้อมูลสินค้าไม่สำเร็จ", status: false});
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Products.findByIdAndDelete(id);
    if (!product) {
      return res
        .status(404)
        .send({status: false, message: "ไม่พบสินค้า"});
    } else {
      return res.status(200).send({status: true, message: "ลบข้อมูลสินค้าสำเร็จ"});
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};
