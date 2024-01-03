const {
    Bands,
    validateband,
  } = require("../../models/product/band.model");
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

  exports.createBand = async (req, res) => {
    try {
      const {error} = validateband(req.body);
      if (error) {
        return res
          .status(400)
          .send({status: false, message: error.details[0].message});
      }
      const data =   await new Bands({
        name: req.body.name,
      }).save();
      res.status(200).send({message: "เพิ่มเเบรน์สินค้าสำเร็จ", status: true , data:data});
    } catch (err) {
      return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
    }
  };

  exports.getBandAll = async (req, res) => {
    try {
      const band = await Bands.find();
      if (band) {
        return res
          .status(200)
          .send({message: "ดึงเเบรนด์สินค้าสำเร็จ", status: true, data: band});
      } else {
        return res
          .status(500)
          .send({message: "ดึงเเบรนด์สินค้าไม่สำเร็จ", status: false});
      }
    } catch (err) {
      return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
    }
  };
  exports.getBandById = async (req, res) => {
    try {
      const category = await Bands.findOne({_id: req.params.id});
      if (category) {
        return res
          .status(200)
          .send({message: "ดึงประเภทสินค้าสำเร็จ", status: true, data: category});
      } else {
        return res
          .status(500)
          .send({message: "ดึงประเภทสินค้าไม่สำเร็จ", status: false});
      }
    } catch (err) {
      return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
    }
  };