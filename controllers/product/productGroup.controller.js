const {
    ProductGroup,
    validateProductGroup,
  } = require("../../models/product/ProductGroup.model");
  const fs = require('fs');
  const multer = require("multer");
  const {google} = require("googleapis");
  const req = require("express/lib/request.js");
  const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
  const REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI;
  const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;
  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );
  
  oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN});
  const drive = google.drive({
    version: "v3",
    auth: oauth2Client,
  });
  
  const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
      // console.log(file.originalname);
    },
  });

exports.createSize = async (req, res) => {
    try {
      const {error} = validateProductGroup(req.body);
      if (error) {
        return res
          .status(400)
          .send({status: false, message: error.details[0].message});
      }
      const data =   await new ProductGroup({
        name: req.body.name,
      }).save();
      res.status(200).send({message: "เพิ่มกลุ่มสินค้าสำเร็จ", status: true , data:data});
    } catch (err) {
      return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
    }
  };

exports.getSizeAll = async (req, res) => {
    try {
      const productGroup = await ProductGroup.find();
      if (productGroup) {
        return res
          .status(200)
          .send({message: "ดึงกลุ่มสินค้าสำเร็จ", status: true, data: productGroup});
      } else {
        return res
          .status(500)
          .send({message: "ดึงกลุ่มสินค้าไม่สำเร็จ", status: false});
      }
    } catch (err) {
      return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
    }
  };

exports.getSizeById = async (req, res) => {
    try {
      const productGroup = await ProductGroup.findOne({_id: req.params.id});
      if (productGroup) {
        return res
          .status(200)
          .send({message: "ดึงกลุ่มสินค้าสำเร็จ", status: true, data: productGroup});
      } else {
        return res
          .status(500)
          .send({message: "ดึงกลุ่มสินค้าไม่สำเร็จ", status: false});
      }
    } catch (err) {
      return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
    }
  };
exports.updateSize= async (req, res) => {
    try {
      const productGroup = await ProductGroup.findByIdAndUpdate(req.params.id, req.body);
      if (productGroup) {
        return res
          .status(200)
          .send({message: "แก้ไขข้อมูลกลุ่มสินค้าสำเร็จ", status: true});
      } else {
        return res
          .status(500)
          .send({message: "แก้ไขข้อมูลกลุ่มสินค้าไม่สำเร็จ", status: false});
      }
    } catch (err) {
      return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
    }
  };
exports.deleteSize = async (req, res) => {
    try {
      const id = req.params.id;
      const productGroup = await ProductGroup.findByIdAndDelete(id);
      if (!productGroup) {
        return res.status(404).send({status: false, message: "ไม่พบกลุ่มสินค้า"});
      } else {
        return res
          .status(200)
          .send({status: true, message: "ลบข้อมูลกลุ่มสินค้าสำเร็จ"});
      }
    } catch (err) {
      return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
    }
  };