const {Suppliers} = require("../../models/user/supplier.model.js");

const fs = require("fs");
const multer = require("multer");
const {google} = require("googleapis");
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

const vali_supplier = (data) => {
  const schema = Joi.object({
    supplier_tel: Joi.string().required().label("กรอกเบอร์ดีลเลอร์"),
    supplier_status: Joi.boolean().default(true),

    supplier_company_name: Joi.string().default("ไม่มี"),
    supplier_company_number: Joi.string().default("ไม่มี"),
    supplier_company_address: Joi.string().default("ไม่มี"),
  });
  return schema.validate(data);
};

exports.create = async (req, res) => {
  try {
    const {error} = vali_supplier(req.body);
    if (error) {
      return res
        .status(400)
        .send({status: false, message: error.details[0].message});
    }
    const supplier = await Suppliers.findOne({
      supplier_company_name: req.body.supplier_company_name,
    });
    if (supplier)
      return res.status(409).send({
        status: false,
        message: "มีชื่อซัพพายเออร์นี้ในระบบแล้ว",
      });
    await new Suppliers({
      ...req.body,
    }).save();
    res
      .status(201)
      .send({message: "เพิ่มข้อมูลซัพพายเออร์สำเร็จ", status: true});
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};

exports.getSupplierAll = async (req, res) => {
  try {
    const supplier = await Suppliers.find();
    if (!supplier) {
      return res
        .status(404)
        .send({status: false, message: "ไม่พบซัพพายเออร์ในระบบ"});
    } else {
      return res
        .status(200)
        .send({status: true, message: "ดึงข้อมูลสำเร็จ", data: supplier});
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};

exports.getSupplierById = async (req, res) => {
  try {
    const id = req.params.id;
    const supplier = await Suppliers.findById(id);
    if (!supplier) {
      return res
        .status(404)
        .send({status: false, message: "ไม่พบซัพพายเออร์ในระบบ"});
    } else {
      return res
        .status(200)
        .send({status: true, message: "ดึงข้อมูลสำเร็จ", data: supplier});
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};

exports.updateSupplier = async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.body) {
      return res
        .status(400)
        .send({status: false, message: error.details[0].message});
    }
    const new_supplier = await Suppliers.findByIdAndUpdate(id, {
      ...req.body,
    });
    if (new_supplier) {
      return res.send({
        status: true,
        message: "แก้ไขข้อมูลซัพพายเออร์เรียบร้อย",
      });
    } else {
      return res.status(400).send({
        status: false,
        message: "ไม่สามารถแก้ไขซัพพายเออร์นี้ได้",
      });
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    const id = req.params.id;
    const supplier = await Suppliers.findByIdAndDelete(id);
    if (!supplier) {
      return res
        .status(404)
        .send({status: false, message: "ไม่พบข้อมูลซัพพายเออร์ในระบบ"});
    } else {
      return res
        .status(200)
        .send({status: true, message: "ลบข้อซัพพายเออร์สำเร็จ"});
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};

exports.updateImgIden = async (req, res) => {
  try {
    let upload = multer({storage: storage}).array("imgCollection", 20);
    upload(req, res, async function (err) {
      if (err) {
        return res.status(403).send({message: "มีบางอย่างผิดพลาด", data: err});
      }
      const reqFiles = [];
      if (!req.files) {
        res.status(500).send({
          message: "มีบางอย่างผิดพลาด",
          data: "No Request Files",
          status: false,
        });
      } else {
        const url = req.protocol + "://" + req.get("host");
        for (var i = 0; i < req.files.length; i++) {
          await uploadFileCreate(req.files, res, {i, reqFiles});
        }
        const id = req.params.id;
        const new_supplier = await Suppliers.findByIdAndUpdate(id, {
          supplier_iden: reqFiles[0],
        });
        if (new_supplier) {
          return res
            .status(200)
            .send({status: true, message: "บันทึกสำเร็จ", data: new_supplier});
        } else {
          return res
            .status(403)
            .send({status: false, message: "ไม่สามารถบันทึกได้"});
        }
      }
    });
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};

exports.updateImgBank = async (req, res) => {
  try {
    let upload = multer({storage: storage}).array("imgCollection", 20);
    upload(req, res, async function (err) {
      if (err) {
        return res.status(403).send({message: "มีบางอย่างผิดพลาด", data: err});
      }
      const reqFiles = [];
      if (!req.files) {
        res.status(500).send({
          message: "มีบางอย่างผิดพลาด",
          data: "No Request Files",
          status: false,
        });
      } else {
        const url = req.protocol + "://" + req.get("host");
        for (var i = 0; i < req.files.length; i++) {
          await uploadFileCreate(req.files, res, {i, reqFiles});
        }
        const id = req.params.id;
        const new_supplier = await Suppliers.findByIdAndUpdate(id, {
          supplier_bookbank: reqFiles[0],
        });
        if (new_supplier) {
          return res
            .status(200)
            .send({status: true, message: "บันทึกสำเร็จ", data: new_supplier});
        } else {
          return res
            .status(403)
            .send({status: false, message: "ไม่สามารถบันทึกได้"});
        }
      }
    });
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};
