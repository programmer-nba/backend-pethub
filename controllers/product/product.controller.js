const {
  Products,
  validateproduct,
} = require("../../models/product/product.model.js");
const{
  PackProducts,
  validatePackProducts,
}=require("../../models/product/productpack.js");

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

exports.create = async (req, res) => {
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
        const productpack = await PackProducts.findOne({product_id:req.body.product_id})//เพิ่มตรงส่วนนี้มา
        for (var i = 0; i < req.files.length; i++) {
          await uploadFileCreate(req.files, res, {i, reqFiles});
          
        }
        const data = {
          logo: reqFiles[0],
          name: req.body.name,
          barcode: req.body.barcode,
          category: req.body.category,
          supplier_id: req.body.supplier_id,
          quantity: req.body.quantity,
          price_cost: req.body.price_cost,
          status: true,
          is_pack:productpack.is_pack,//เพิ่มตรงส่วนนี้มา
        };
        const new_product = await Products.create(data);
        if (new_product) {
          return res.status(200).send({status: true, message: "บันทึกสำเร็จ", data: new_product});
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
      return res.status(404).send({status: false, message: "ไม่พบสินค้า"});
    } else {
      return res
        .status(200)
        .send({status: true, message: "ลบข้อมูลสินค้าสำเร็จ"});
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};

