const {Shops, validateShop} = require("../../models/shop/shop.model.js");
const {Cashier, validateCashier} = require("../../models/user/cashier.model");
const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const {PreOrderProducts} = require("../../models/product/preorder.model");
const {
  PreOrderProductShell,
} = require("../../models/product/preordershell.model");
const {ProductShall} = require("../../models/product/product.shall.model.js");
const {
  preorder_shopping,
} = require("../../models/ิbuy_product/buyproduct.model.js");
const {Products} = require("../../models/product/product.model.js")
const {PromotionFree} =  require("../../models/promotion/promotionbyfree.js")
const {Promotion} =  require("../../models/promotion/promotion.model.js")
const {ProductShops} = require("../../models/product/product.shop.model.js")
const fs = require("fs");
const multer = require("multer");
const {google} = require("googleapis");
const { array } = require("joi");
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
    return res.status(400).send({message: "Invalid value for 'i'"});
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

exports.findProductAll = async (req, res) => {
  try {
    const shop = await ProductShall.find();
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

exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const shop = await ProductShall.findByIdAndDelete(id);
    if (!shop) {
      return res
        .status(404)
        .send({status: false, message: "ไม่พบข้อมูลสินค้าในระบบ"});
    } else {
      return res.status(200).send({status: true, message: "ลบสินค้าสำเร็จ"});
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};

exports.calcelProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const updateStatus = await ProductShall.findOne({_id: id});
    console.log(updateStatus);
    if (updateStatus) {
      updateStatus.status.push({
        name: "ยกเลิกการสั่งซื้อ",
        timestamps: dayjs(Date.now()).format(""),
      });
      updateStatus.save();
      return res.status(200).send({
        status: true,
        message: "ยกเลิกการสั่งซื้อสำเร็จ",
        data: updateStatus,
      });
    } else {
      return res.status(500).send({
        message: "มีบางอย่างผิดพลาด",
        status: false,
      });
    }
  } catch (error) {
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.preorder = async (req, res) => {
  try {
    const status = {
      name: "รอตรวจสอบ",
      timestamps: dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    };
    let order = [];
    let grandTotal = 0;
    let normalTotal = 0;
    let totalDiscount = 0;

    const product_detail = req.body.product_detail;

    for (let item of product_detail) {
      const result = await calculateProductPrice(item);
      order.push(result);
      normalTotal += result.normaltotal;
      totalDiscount += result.discountAmountPerItem;
      grandTotal += result.total;
      await ProductShall.updateOne(
        { _id: item.productId },
        { $inc: { product_amount: -item.ProductAmount } }
      );
    }
    const customer_total = normalTotal;
    const invoiceshoppingnumber = await invoiceShoppingNumber();

    const shop = await Shops.findOne({ _id: req.body.shop_id });

    const order_product = await new preorder_shopping({
      ...req.body,
      invoiceShoppingNumber:invoiceshoppingnumber,
      customer_shop_id:shop ? shop.shop_name : "ไม่พบชื่อร้าน",
      customer_detail: order,
      total: customer_total,
      discount: totalDiscount,
      net: grandTotal,
      timestamps: dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    }).save();

    if (order_product) {
      return res.status(200).send({
        status: true,
        message: "สั่งซื้อสินค้าทำเสร็จ",
        data: order_product,
      });
    } else {
      return res.status(500).send({
        message: "มีบางอย่างผิดพลาด",
        status: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "มีบางอย่างผิดพลาด222",
      status: false,
      error: error.message,
    });
  }
};


exports.ShowReceiptById = async (req, res) => {
  try {
    const id = req.params.id;
    const preorder_list = await preorder_shopping.findOne({invoiceShoppingNumber: id});
    if (preorder_list) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลรายการสั่งซื้อสำเร็จ",
        data: preorder_list,
      });
    } else {
      return res.status(500).send({
        message: "มีบางอย่างผิดพลาด",
        status: false,
      });
    }
  } catch (error) {
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.ShowReceiptAll = async (req, res) => {
  try {
    const id = req.params.id;
    const preorder_list = await preorder_shopping.find();
    if (preorder_list) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลรายการสั่งซื้อสำเร็จ",
        data: preorder_list,
      });
    } else {
      return res.status(500).send({
        message: "มีบางอย่างผิดพลาด",
        status: false,
      });
    }
  } catch (error) {
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.getByBarcode = async (req,res)=>{
  try {
    const shop_id = req.params.shop_id;
    const barcode = req.params.barcode;
    const product = await ProductShall.find({
      shop_id: shop_id,
      barcode: barcode,
    });
    if (product) {
      return res.status(200).send({status: true, data: product});
    } else {
      return res
        .status(400)
        .send({status: false, message: "ดึงข้อมูลไม่สำเร็จ"});
    }
  } catch (err) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
}

async function generatePublicUrl(res) {
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
  } catch (error) {
    console.log(error.message);
  }
}

async function invoiceShoppingNumber(date) {
  const order = await preorder_shopping.find();
  let invoice_sheopping = null;
  if (order.length !== 0) {
    let data = "";
    let num = 0;
    let check = null;
    do {
      num = num + 1;
      data = `BUY${dayjs(date).format("YYYYMMDD")}`.padEnd(15, "0") + num;
      check = await preorder_shopping.find({invoice: data});
      if (check.length === 0) {
        invoice_sheopping =
          `BUY${dayjs(date).format("YYYYMMDD")}`.padEnd(15, "0") + num;
      }
    } while (check.length !== 0);
  } else {
    invoice_sheopping =
      `BUY${dayjs(date).format("YYYYMMDD")}`.padEnd(15, "0") + "1";
  }
  return invoice_sheopping;
}

// ฟังก์ชันคำนวณราคาสินค้า
const calculateProductPrice = async (item) => {
  let total = 0;
  let discount = 0;
  let discountdetail = "";
  let normaltotal = 0;
  const product = await ProductShall.findOne({ product_id: item.product_id });

  if (product.ProductAmount < item.product_amount) {
    console.log("จำนวนสินค้าไม่เพียงพอ");
  } else {
    // ตรวจสอบว่าสินค้ามีรหัส promotion หรือไม่
    if (product.promotion !== "") {
      const normalPrice = calculateNormalPrice(product.retailprice.level1, item.product_amount); // คำนวณราคาปกติ
      // ถ้ามีรหัส promotion ให้คำนวณส่วนลด
      const promotion = await Promotion.findOne({ _id: product.promotion });
      const price =
        promotion && promotion.discountPercentage
          ? calculateDiscountedPrice(product.retailprice.level1, promotion.discountPercentage, item.product_amount)
          : product.retailprice.level1 * item.product_amount;
      normaltotal = normalPrice;
      total += price;
      discount = promotion.name;
      discountdetail = promotion.description;
      // ลดจำนวนสินค้าที่ถูกสั่งซื้อออกจากจำนวนทั้งหมดในคลังสินค้า
      product.ProductAmount -= item.product_amount;
      await product.save();
    } else {
      console.log("ไม่พบข้อมูลรหัสโปรโมชั่น");
      // ถ้าไม่มีรหัส promotion ให้คำนวณราคาตามปกติ
      const price = product.retailprice.level1 * item.product_amount;
      normaltotal = price;
      total += price;
      // ลดจำนวนสินค้าที่ถูกสั่งซื้อออกจากจำนวนทั้งหมดในคลังสินค้า
      product.ProductAmount -= item.product_amount;
      await product.save();
    }
  }
  const discountAmountPerItem = normaltotal - total; // คำนวณส่วนลดต่อรายการ
  return {
    product_id: product.product_id,
    amount: item.product_amount,
    normaltotal,
    discountAmountPerItem,
    total,
    discount,
    discountdetail,
  };
};
// ฟังก์ชันคำนวณราคาปกติ
const calculateNormalPrice = (retailprice, quantity) => {
  return retailprice * quantity;
};
// ฟังก์ชันคำนวณราคาที่ลดหลังจากส่วนลด
const calculateDiscountedPrice = (retailprice, discountPercentage, quantity) => {
  return (retailprice - (retailprice * discountPercentage) / 100) * quantity;
};
