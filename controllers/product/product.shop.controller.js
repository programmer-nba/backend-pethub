const multer = require("multer");
const fs = require("fs");
const {
  ProductShops,
  validateProduct,
} = require("../../models/product/product.shop.model");
const {PreOrderProducts} = require("../../models/product/preorder.model");
const admin = require("../../models/product/product.shop.model");
const {Products} = require("../../models/product/product.model");
const dayjs = require("dayjs");
const {google} = require("googleapis");
const {Employees} = require("../../models/user/employee.model");
const {Shops} = require("../../models/shop/shop.model");
const jwt = require("jsonwebtoken");
const {response} = require("express");
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
    cb(null, Date.now() + "-");
  },
});

exports.create = async (req, res) => {
  try {
    let upload = multer({storage: storage}).single("productShop_image");
    upload(req, res, async function (err) {
      if (!req.file) {
        const {error} = validateProduct(req.body);
        if (error)
          return res.status(400).send({message: error.details[0].message});
        const product = await new ProductShops({
          ...req.body,
        }).save();
        res
          .status(201)
          .send({message: "สร้างรายงานใหม่เเล้ว", status: true, data: product});
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      } else {
        uploadFileCreate(req, res);
      }
    });
    async function uploadFileCreate(req, res) {
      const filePath = req.file.path;
      let fileMetaData = {
        name: req.file.originalname,
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
        console.log(req.body);
        const {error} = validate(req.body);
        if (error)
          return res.status(400).send({message: error.details[0].message});
        await new ProductShops({
          ...req.body,
          productShop_image: response.data.id,
        }).save();
        res.status(201).send({message: "สร้างรายงานใหม่เเล้ว", status: true});
      } catch (error) {
        res.status(500).send({message: "Internal Server Error", status: false});
      }
    }
  } catch (error) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.getProductAll = async (req, res) => {
  try {
    ProductShops.find()
      .then(async (data) => {
        res.status(201).send({data, message: "success", status: true});
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "มีบางอย่างผิดพลาด",
        });
      });
  } catch (err) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.findByShopId = async (req, res) => {
  try {
    const id = req.params.id;
    ProductShops.find({productShop_id: id})
      .then((data) => {
        if (!data)
          res
            .status(404)
            .send({message: "ไม่สามารถหารายงานนี้ได้", status: false});
        else res.send({data, status: true});
      })
      .catch((err) => {
        res.status(500).send({
          message: "มีบางอย่างผิดพลาด",
          status: false,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "มีบางอย่างผิดพลาด",
      status: false,
    });
  }
};

// ร้านค้าย่อย สั่ง preorder สินค้าส่งให้แอดมินตรวจสอบ
exports.preorderProduct = async (req, res) => {
  console.log(req.body);
  try {
    const status = {
      name: "รอตรวจสอบ",
      timestamps: dayjs(Date.now()).format(""),
    };
    const invoice = await invoiceNumber();
    const preordernumber = await orderNumber();

    const order_product = await new PreOrderProducts({
      ...req.body,
      invoice: invoice,
      ordernumber: preordernumber,
      status: status,
      timestamps: dayjs(Date.now()).format(""),
    }).save();
    if (order_product) {
      return res.status(200).send({
        status: true,
        message: "สั่งซื้อสินค้าทำเสร็จ",
        data: order_product,
      });
    } else {
      return res.status(500).send({
        message: order_product,
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

//เพิ่มสินค้าเข้า stock เเอดมิน
exports.PreorderStock = async (req, res) => {
  try {
    const id = req.params.id;
    const preorders = await PreOrderProducts.findOne({ordernumber: id});
    console.log(preorders);

    // const productdetails = preorders

    const productshop = await ProductShops.create({
      shop_id: req.body.shop_id,
      ordernumber: id,
      products: preorders.product_detail, //เพิ่มส้นค้าแบบ array ให้เเสดงออกโดยการใช้ ...
    });
    // console.log('-----------44444444--------------')
    console.log(productshop);

    // const product_shop = await ProductShops.create(updateStatus)

    return res.status(200).send({
      status: true,
      message: "เพิ่มสินค้าสำเร็จ",
      data: productshop,
    });
  } catch (error) {
    return res.status(500).send({message: error.message, status: false});
  }
};

//เพิ่มสินค้าเข้า stock พนักงงาน
exports.PreorderEmpStock = async (req, res) => {
  try {
    const orderId = req.params.id;
    // ดึงข้อมูล PreOrderProducts จาก ordernumber
    const preorders = await PreOrderProducts.findOne({ordernumber: orderId });
    const amount = preorders.product_detail.length;

    for (let i = 0; i < amount; i++) { //ใช้ loop ในการค้นหา
      const product_id = preorders.product_detail[i].product_id;
      const existingProduct = await ProductShops.findOne({ product_id: product_id });//ค้นหาid จากProductShops เเล้วมาเก็บไว้ในตัวแปร existingProduct
      const product_admin = await Products.findOne({ _id: product_id });//ค้นาหา id Products เเล้วมาเก็บไว้ในตัวแปร product_admin
      if (!existingProduct) { //การสร้างข้อมูลเข้าไปใหม่
        const data = {
          product_id: preorders.product_detail[i].product_id,
          shop_id: preorders.shop_id,
          name: preorders.product_detail[i].product_name,
          totalProductAmount: preorders.product_detail[i].product_amount,
          price_cost: product_admin.price_cost,
          barcode: product_admin.barcode,
        
         
        }; 
         const product = await new ProductShops(data).save();
      

         if (!product) {
          res.status(403).send({ status: false, message: "บันทึกไม่สำเร็จ" });
         }
      } 
       else {
         const updatedAmount =
          preorders.product_detail[i].product_amount + existingProduct.totalProductAmount;
           const new_amount = {
           totalProductAmount: updatedAmount,
           
         };
  
        //  console.log(new_amount);
         const updatedProduct = await ProductShops.findByIdAndUpdate(
           existingProduct._id,
           new_amount,
           { new: true }
         );

         if (!updatedProduct) {
           res.status(403).send({ status: false, message: "มีบางอย่างผิดพลาด" });
         }
       }
    }

    res.status(200).send({ status: true, message: "บันทึกข้อมูลสำเร็จ" });
  } catch (error) {
    res.status(500).send({ message: error.message, status: false });
  }
};

// เเสดงสินค้าก่อนเพิ่มเข้าสต๊อกสินค้า

// //รับค่าบาร์โค๊ดจากข้อมูลมากเเสดงโดยการjoin เข้ามาเเสดง
// exports.PreorderStock = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const preorders = await PreOrderProducts.findOne({shop_id:id})
//     console.log(preorders)

//      const productdetails =  preorders.product_detail.map(async(item)=>{
//       const product = await Products.findById(item.product_id)
//       const product_detail = {price_cost:product.price_cost,barcode:product.barcode}
//       return product_detail
//      })
//       console.log(productdetails)
//         const productshop = await ProductShops.create({
//         shop_id:id,
//         products:preorders.product_detail,//เพิ่มส้นค้าแบบ array ให้เเสดงออกโดยการใช้ ...
//       });
// // console.log('-----------44444444--------------')
//       console.log(productshop)

//     // const product_shop = await ProductShops.create(updateStatus)

//       return res.status(200).send({
//         status: true,
//         message: "เพิ่มสินค้าสำเร็จ",
//         data: productshop,
//       });
//   } catch (error) {
//     return res.status(500).send({message: error.message, status: false});
//   }
// }

//เเสดงสินค้าที่เพิ่มเข้าสต๊อกทั้งหมด
exports.getStock = async (req, res) => {
  try {
    const id = req.params.id;

    const mystock = await ProductShops.find(); //{shop_id:id} เอาใส่ไว้ใน() findOne

    return res.send(mystock);
  } catch (error) {
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

//เเสดงสินค้าที่เพิ่มเข้าสต๊อกแบบ id
exports.checkEmpStock = async (req, res) => {
  try {
    const id = req.params.id;
    const mystock = await ProductShops.findOne({product_id: id}); //{shop_id:id} เอาใส่ไว้ใน() findOne
    return res.send(mystock);
  } catch (error) {
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

//เพิ่มสินค้าเข้าไปในพรีออเดอร์
exports.addProducts = async (req, res) => {
  var chkOrderID = await order.find();
  try {
    var getPreproduct = await PreOrderProducts.find({_id: req.body._id}); //ส่งค่ามาจากด้าน front end โดยใช้id

    console.log("Status : ", getPreproduct[0].status);
    //  console.log("Status : ", getPreproduct[0].status.length)
    var indexLast = getPreproduct[0].status.length - 1;
    var chk_status = getPreproduct[0].status[indexLast].name;
    console.log(chk_status);
    const teatid = await PreOrderProducts.find({id: req.body._id});
    // if(teatid.length > 0) {
    //     console.log("มีการสร้างไอดีนี้ไปแล้ว")
    //     return res.status(200).send({message: "มีการสร้างไอดีนี้ไปแล้ว"})
    // }
    // console.log("teatid", teatid )
    console.log(chk_status);
    if (chk_status == "ยืนยันการสั่งซื้อ") {
      let data = {
        shop_id: req.body.shop_id,
        invoice: req.body.invoice,
        employee_name: req.body.employee_name,
        product_detail: req.body.product_detail,
        timestamps: Date.now(),
      };
      const createOrder = new order(data);
      const createOrderData = await createOrder.save().populate("shop_id");

      return res.status(200).send({message: " สำเร็จ", data: createOrderData});
    }

    return res
      .status(500)
      .send({message: "รายการนี้ยังไม่ได้ยืนยันการสั่งซื้อ"});

    //  const createOrder = new order(data);
    //  const createOrderData = await createOrder.save()
  } catch (error) {
    console.error(error);
    res.status(500).send("ไม่สามารถเซฟได้");
  }
};

exports.getPreorderAll = async (req, res) => {
  try {
    const preorder_list = await PreOrderProducts.find();
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

//ดึงข้อมูลแบบ id พรีออเดอร์
exports.getPreorderEmpById = async (req, res) => {
  try {
    const id = req.params.id;
    const preorder_list = await PreOrderProducts.findOne({ordernumber: id});
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

exports.getPreorderById = async (req, res) => {
  try {
    const id = req.params.id;
    const preorder_list = await PreOrderProducts.findOne({_id: id});
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

exports.getPreorderByShopId = async (req, res) => {
  try {
    const id = req.params.id;
    const preorder_list = await PreOrderProducts.findOne({shop_id: id});
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

exports.confirmPreorder = async (req, res) => {
  try {
    const id = req.params.id;
    const updateStatus = await PreOrderProducts.findOne({_id: id});
    console.log(updateStatus);
    if (updateStatus) {
      updateStatus.status.push({
        name: "ยืนยันการสั่งซื้อ",
        timestamps: dayjs(Date.now()).format(""),
      });
      updateStatus.save();
      return res.status(200).send({
        status: true,
        message: "ยืนยันการสั่งซื้อสำเร็จ",
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

exports.candelPreorderEmyee = async (req, res) => {
  try {
    const id = req.params.id;
    const updateStatus = await PreOrderProducts.findOne({ordernumber: id});
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

exports.cancelPreorder = async (req, res) => {
  try {
    const id = req.params.id;
    const updateStatus = await PreOrderProducts.findOne({_id: id});
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

//คำสั่งเปลี่ยนสถานะเป็น นำเข้าสต๊อกสิน
exports.statusaddPreorder = async (req, res) => {
  try {
    const id = req.params.id;
    const updateStatus = await PreOrderProducts.findOne({ordernumbe: id});
    console.log(updateStatus);
    if (updateStatus) {
      updateStatus.status.push({
        name: "นำเข้าสต๊อก",
        timestamps: dayjs(Date.now()).format(""),
      });
      updateStatus.save();
      return res.status(200).send({
        status: true,
        message: "นำเข้าสต๊อกสินค้าสำเร็จ",
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

exports.statusPreorder = async (req, res) => {
  try {
    const id = req.params.id;
    const updateStatus = await PreOrderProducts.findOne({_id: id});
    console.log(updateStatus);
    if (updateStatus) {
      updateStatus.status.push({
        name: "สถาณะการจัดส่งสินค้า",
        timestamps: dayjs(Date.now()).format(""),
      });
      updateStatus.save();
      return res.status(200).send({
        status: true,
        message: "ยืนยันการจัดส่งสินค้า",
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

//ค้นหาและสร้างเลข invoice
async function invoiceNumber(date) {
  const order = await PreOrderProducts.find();
  let invoice_number = null;
  if (order.length !== 0) {
    let data = "";
    let num = 0;
    let check = null;
    do {
      num = num + 1;
      data = `PETHUB${dayjs(date).format("YYYYMMDD")}`.padEnd(15, "0") + num;
      check = await PreOrderProducts.find({invoice: data});
      if (check.length === 0) {
        invoice_number =
          `PETHUB${dayjs(date).format("YYYYMMDD")}`.padEnd(15, "0") + num;
      }
    } while (check.length !== 0);
  } else {
    invoice_number =
      `PETHUB${dayjs(date).format("YYYYMMDD")}`.padEnd(15, "0") + "1";
  }
  return invoice_number;
}

//ค้นหาเเละสร้างเลข ordernumber คือเลขนำเข้าสินค้า
async function orderNumber(date) {
  const order = await PreOrderProducts.find();
  let order_number = null;
  if (order.length !== 0) {
    let data = "";
    let num = 0;
    let check = null;
    do {
      num = num + 1;
      data = `ORDER${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + num;
      check = await PreOrderProducts.find({ordernumber: data});
      if (check.length === 0) {
        order_number =
          `ORDER${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + num;
      }
    } while (check.length !== 0);
  } else {
    order_number =
      `ORDER${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + "1";
  }
  return order_number;
}

exports.postPreorders = async (req, res) => {
  try {
    const preorders = await PreOrderProducts.find({
      status: {$elemMatch: {name: "ยืนยันการสั่งซื้อ"}},
    });
    if (!preorders) {
      res.send("ไม่เจอ");
    }
    console.log(preorders);
    res.send({});
  } catch (error) {
    console.log(error);
    res.status(500).send("ไม่สามารถเซฟได้");
  }
};
