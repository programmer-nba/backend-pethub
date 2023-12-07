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
// exports.getByBarcode = async (req, res) => {
//     try {
//       const shop_id = req.params.shop_id;
//       const barcode = req.params.barcode;
//       const product = await ProductShall.find({
//         productShop_id: shop_id,
//         productShop_barcode: barcode,
//       });
//       if (product) {
//         return res.status(200).send({status: true, data: product});
//       } else {
//         return res
//           .status(400)
//           .send({status: false, message: "ดึงข้อมูลไม่สำเร็จ"});
//       }
//     } catch (err) {
//       res.status(500).send({message: "มีบางอย่างผิดพลาด"});
//     }
//   };
exports.preorder = async (req, res) => {
  try {
    const status = {
      name: "รอตรวจสอบ",
      timestamps: dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    };
    console.log(req.body)
    const product_detail = req.body.product_detail;
    for (let item of product_detail) {
      let total = 0;
      const product = await ProductShall.findOne({product_id: item.product_id});
      if (product.ProductAmount < item.product_amount) {
        console.log("จำนวนสินค้าไม่เพียงพอ");
      } else {
        const price = product.price * item.product_amount;
        total += price;
      }
      const order = {
        product_id: product.product_id,
        product_name: product.product_name,
        amount: item.product_amount,
        total: total,
      }
      console.log(order);
    }
    const product_name = await ProductShall.findOne({_id: req.body._id});

    // const order_product = await new preorder_shopping({
    //   ...req.body,
    //   poshop_shop_id: req.body.shop_id,
    //   poshop_detail: req.body.product_detail,
    //   status: status,
    //   timestamps: dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    // }).save();

    // const result = req.body.product_detail.reduce((acc, curr) => {
    //   const existingProduct = acc.find(
    //     (item) => item.product_id === curr.product_id
    //   );

    //   if (existingProduct) {
    //     // ถ้ามี product_id เดียวกันแล้วให้บวกเพิ่ม
    //     existingProduct.product_amount += curr.product_amount;
    //   } else {
    //     // ถ้ายังไม่มีให้เพิ่ม Object ใหม่เข้าไปใน Array
    //     acc.push({
    //       product_id: curr.product_id,
    //       product_amount: curr.product_amount,
    //     });
    //   }
    //   return acc;
    // }, []);
    // const updatedOrder = await preorder_shopping.findOneAndUpdate(
    //   {_id: req.body._id},
    //   {
    //     $set: {
    //       poshop_detail: result,
    //       // สามารถเพิ่ม properties อื่น ๆ ที่ต้องการอัปเดตได้ตามต้องการ
    //     },
    //   },
    //   {new: true, upsert: true}
    // );
    // console.log(updatedOrder);
    // // ให้ทำการแก้ไขข้อมูลในฐานข้อมูล
    // if (updatedOrder) {
    //   return res.status(200).send({
    //     status: true,
    //     message: "สั่งซื้อสินค้าทำเสร็จ",
    //     data: {_id: updatedOrder._id, ...updatedOrder._doc},
    //   });
    // } else {
    //   return res.status(500).send({
    //     message: "มีบางอย่างผิดพลาด",
    //     status: false,
    //   });
    // }
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
    const preorder_list = await preorder_shopping.findOne({_id: id});
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
