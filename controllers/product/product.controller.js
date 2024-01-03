const {
  Products,
  validateproduct,
} = require("../../models/product/product.model.js");
const{
  PackProducts,
}=require("../../models/product/productpack.model.js");

const {ProductGroup} =  require("../../models/product/ProductGroup.model.js")
const {Bands} =require("../../models/product/band.model.js")
const fs = require("fs");
const multer = require("multer");
const {google} = require("googleapis");
const req = require("express/lib/request.js");
const {Categorys} = require("../../models/product/category.model.js")
const {Suppliers} = require("../../models/user/supplier.model.js")
const xlsx = require('xlsx');
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

//เพิ่มสินค้าแบบชิ้น
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
        // const productpack = await PackProducts.findOne({product_id:req.body.product_id})//เพิ่มตรงส่วนนี้มา
        for (var i = 0; i < req.files.length; i++) {
          await uploadFileCreate(req.files, res, {i, reqFiles});
          
        }
        const data = {
          logo: reqFiles[0],
          name: req.body.name,
          barcode: req.body.barcode,
          category: req.body.category,
          productgroup:req.body.productgroup,
          bands:req.body.bands,
          taste:req.body.taste,
          size:req.body.size,
          supplier_id: req.body.supplier_id,
          quantity: req.body.quantity,
          price_cost: req.body.price_cost,
          retailprice:req.body.retailprice,
          wholesaleprice:req.body.wholesaleprice,
          memberretailprice:req.body.memberretailprice,
          memberwholesaleprice:req.body.memberwholesaleprice,
          status: true,
          // is_pack:productpack.is_pack,//เพิ่มตรงส่วนนี้มา
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

//เพิ่มสินค้าแบบเป็นเเพ็คสินค้า โดย 
exports.createPack = async (req, res) => {
  try {
    
    const product_id = req.body.product_id;

    const productpack = await Products.findOne({_id: product_id });
    const existingPack = await PackProducts.findOne({ product_id });

    if (existingPack) {
      return res.status(400).send({
        status: false,
        message: "สินค้าตัวนี้ถูกใช้ไปแล้ว สามารถสร้าง Pack สินค้าได้เพียงครั้งเดียว",
      });
    }

    if (productpack) {
      const amount = req.body.amount;
      const price_cost = req.body.price_cost; // เพิ่มบรรทัดนี้
      // const total_price = (price_cost * amount).toFixed(2);; // ใช้ price_cost ที่ระบุจาก request body

      const testpack = {
        product_id: productpack.id,
        logo:productpack.logo,
        name: productpack.name,
        name_pack:req.body.name_pack,
        barcode: productpack.barcode,
        amount: amount,
      };

      // บันทึกข้อมูลลงใน MongoDB
      const order_product = await new PackProducts(testpack).save();

      if (order_product) {
        return res.status(200).send({
          status: true,
          message: "เพิ่มสิ้นค้าสำเร็จ",
          data: order_product,
        });
      } else {
        return res.status(500).send({
          message: "มีบางอย่างผิดพลาดในการบันทึกข้อมูล",
          status: false,
        });
      }
    } else {
      return res.status(404).send({
        message: "ไม่พบสินค้าที่ตรงกับ product_id ที่ระบุ",
        status: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "มีบางอย่างผิดพลาด",
      status: false,
      error: error.message,
    });
  }
};

//ดึงสินค้าออกมาเป็นแบบเเพ็ค
exports.ChackPackAll = async (req, res) => {
  try {
    const packproduct = await PackProducts.find();
    if (packproduct) {
      return res
        .status(200)
        .send({message: "ดึงข้อมูลสินค้าสำเร็จ", status: true, data: packproduct});
    } else {
      return res
        .status(500)
        .send({message: "ดึงข้อมูลสินค้าไม่สำเร็จ", status: false});
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};

//ดึงสินค้าออกมาเป็นแบบเเพ็ค เเเค่ 1เเพ็ค
exports.ChackPackById = async (req,res) =>{
  try {
    const packproduct = await PackProducts.findOne({_id: req.params.id});
    if (packproduct) {
      return res
        .status(200)
        .send({message: "ดึงข้อมูลสินค้าสำเร็จ", status: true, data: packproduct});
    } else {
      return res
        .status(500)
        .send({message: "ดึงข้อมูลสินค้าไม่สำเร็จ", status: false});
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
}

//ดึงสินค้าออกมาเป็นแบบเเพ็ค ตามจำนวนเเพ็คที่มี
exports.ChackPackProductPack = async (req,res) =>{
  try {
    const packproduct = await PackProducts.find({ product_id: req.params.id });
    if (packproduct) {
      return res
        .status(200)
        .send({message: "ดึงข้อมูลสินค้าสำเร็จ", status: true, data: packproduct});
    } else {
      return res
        .status(500)
        .send({message: "ดึงข้อมูลสินค้าไม่สำเร็จ", status: false});
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
}

exports.UpdateProduckPack = async(req,res) =>{
  try {
    
    const product = await PackProducts.findByIdAndUpdate(req.params.id, req.body);
    if (product) {
      return res
        .status(200)
        .send({message: "แก้ไขข้อมูลสินค้าแบบเป็นเเพ็คสำเร็จ", status: true});
    } else {
      return res
        .status(500)
        .send({message: "แก้ไขข้อมูลสินค้าแบบเป็นเเพ็คไม่สำเร็จ", status: false});
    }
  } catch (err) {

    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
}

exports.deleteProductPack = async(req,res) =>{
  try {
    const id = req.params.id;
    const product = await PackProducts.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).send({status: false, message: "ไม่พบสินค้าแบบเป็นเเพ็ค"});
    } else {
      return res
        .status(200)
        .send({status: true, message: "ลบข้อมูลสินค้าแบบเป็นเเพ็คสำเร็จ"});
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};

//ดึงสินจากตาราง product 
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
        // const productpack = await PackProducts.findOne({product_id:req.body.product_id})//เพิ่มตรงส่วนนี้มา
        for (var i = 0; i < req.files.length; i++) {
          await uploadFileCreate(req.files, res, {i, reqFiles});
        }
        const data = {
          logo: reqFiles[0],
          name: req.body.name,
          barcode: req.body.barcode,
          category: req.body.category,
          productgroup:req.body.productgroup,
          bands:req.body.bands,
          taste:req.body.taste,
          size:req.body.size,
          supplier_id: req.body.supplier_id,
          quantity: req.body.quantity,
          price_cost: req.body.price_cost,
          retailprice:req.body.retailprice,
          wholesaleprice:req.body.wholesaleprice,
          memberretailprice:req.body.memberretailprice,
          memberwholesaleprice:req.body.memberwholesaleprice,
          status: true,
          // is_pack:productpack.is_pack,//เพิ่มตรงส่วนนี้มา
        };
        const new_product = await Products.findByIdAndUpdate(req.params.id,data,{new:true});
        if (new_product) {
          return res.status(200).send({status: true, message: "แก้ไขข้อมูลสินค้าสำเร็จ", data: new_product});
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

exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Products.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).send({status: false, message: "ไม่พบสินค้า"});
    } else {
      const packproduct = await PackProducts.findOneAndDelete({product_id:id})
      return res
        .status(200)
        .send({status: true, message: "ลบข้อมูลสินค้าสำเร็จ"});
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};

exports.createEcelProduct = async (req, res) => {
  console.log(req.body)
  try {
    let category = await Categorys.findOne({ name: req.body.category });
    if (!category) {
      category = await Categorys.create({ name: req.body.category });
    }
    let bands = await Bands.findOne({ name: req.body.bands })
    console.log(bands)
    let supplier = await Suppliers.findOne({ supplier_company_name: req.body.supplier_id });
    let productgroup = await ProductGroup.findOne({name:req.body.productgroup})
    if (!productgroup) {
      productgroup = await ProductGroup.create({ name: req.body.productgroup });
    }
    const productData = {
      name: req.body.name,
      barcode: req.body.barcode,
      category: category._id,
      supplier_id: (supplier !=null? supplier._id: 'ไม่มีซัพพลายเออร์ตัวนี้'),
      bands: (bands !=null? bands._id:"ไม่มีเเบรนด์ตัวนี้"),
      productgroup:productgroup._id,
      size:req.body.size,
      taste:req.body.taste,
      quantity: req.body.quantity,
      price_cost: req.body.price_cost,
      retailprice: req.body.retailprice,
      wholesaleprice: req.body.wholesaleprice,
      memberretailprice: req.body.memberretailprice,
      memberwholesaleprice: req.body.memberwholesaleprice,
      status: true,
    };
    const products = await Products.create([productData]);
    const productId = products[0]._id;
    const { logo, name, barcode } = products[0];
    if(req.body.name_pack !=undefined){
      let packProduct = await PackProducts.findOne({ name_pack: req.body.name_pack});
      if (!packProduct) {
        packProduct = await PackProducts.create({ product_id: productId, logo, name, barcode, amount: req.body.amount, name_pack: req.body.name_pack });
      }
    }
    return res.status(200).send({
        status: true,
        message: 'สร้างผลิตภัณฑ์สำเร็จ',
        data: {
          products,
          supplier,
        },
      });
 
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};










