const {
  Categorys,
  validatecategory,
} = require("../../models/product/category.model.js");
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
//update image
async function uploadFileCreate(req, res, {i, reqFiles}) {
  if (!req[i]) {
    console.error("Invalid value for 'i'");
    return res.status(400).send({ message: "Invalid value for 'i'" });
  }
  const filePath = req[i].path;
  let fileMetaData = {
    name: req.originalname,
    parents: [process.env.GOOGLE_DRIVE_IMAGE_PRODUCT],
  };
  let media = {
    body: fs.createReadStream(filePath),
  };
  try {
    const response = await drive.files.create({
      resource: fileMetaData,
      media: media,
    });

    generatePublicUrl(response.data.id);
    reqFiles.push(response.data.id);
  } catch (error) {
    res.status(500).send({message: "Internal Server Error"});
  }
}

async function generatePublicUrl(res) {
  console.log("generatePublicUrl");
  try {
    const fileId = res;
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    const result = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink, webContentLink",
    });
    console.log(result.data);
  } catch (error) {
    console.log(error);
    return res.status(500).send({message: "Internal Server Error"});
  }
}

exports.create = async (req, res) => {
  try {
    const {error} = validatecategory(req.body);
    if (error) {
      return res
        .status(400)
        .send({status: false, message: error.details[0].message});
    }
    const data =   await new Categorys({
      name: req.body.name,
    }).save();
    res.status(200).send({message: "เพิ่มประเภทสินค้าสำเร็จ", status: true , data:data});
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};

exports.getCategoryAll = async (req, res) => {
  try {
    const category = await Categorys.find();
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

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Categorys.findOne({_id: req.params.id});
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

exports.updateCategory= async (req, res) => {
  try {
    // const {error} = validateproduct(req.body);
    // if (error) {
    //   return res
    //     .status(400)
    //     .send({status: false, message: error.details[0].message});
    // }
    const category = await Categorys.findByIdAndUpdate(req.params.id, req.body);
    if (category) {
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

exports.deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Categorys.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).send({status: false, message: "ไม่พบประเภทสินค้า"});
    } else {
      return res
        .status(200)
        .send({status: true, message: "ลบข้อมูลประเภทสินค้าสำเร็จ"});
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};
