const multer = require("multer");
const fs = require("fs");
const {
  ProductShops,
  validateProduct,
} = require("../../models/product/product.shop.model");
const {PreOrderProducts} = require("../../models/product/preorder.model");
const admin = require("../../models/product/product.shop.model")
const dayjs = require("dayjs");
const {google} = require("googleapis");
const {Employees} = require("../../models/user/employee.model");
const {Shops} = require("../../models/shop/shop.model");
const jwt = require("jsonwebtoken");
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

exports.preorderProduct = async (req, res) => {
  try {
    const status = {
      name: "รอตรวจสอบ",
      timestamps: dayjs(Date.now()).format(""),
    };
    const invoice = await invoiceNumber();
    const order_product = await new PreOrderProducts({
      ...req.body,
      invoice: invoice,
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
        message: "มีบางอย่างผิดพลาด",
        status: false,
      });
    }
  } catch (error) {
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

//เพิ่มสินค้าเข้า stock
exports.PreorderStock = async (req, res) => {
  try {
    const id = req.params.id;
    const preorders = await PreOrderProducts.findOne({shop_id:id});
    console.log(preorders)
  
        const productshop = await ProductShops.create({
        shop_id:id ,
        name:"" , //ชื่อสินค้า
        logo: "",// ภาพสินค้า
        price_cost:"" , //ราคาต้นทุน
        price:"",//ราคาสินค้า
        
       // products:[...preorders.product_detail],//เพิ่มส้นค้าแบบ array ให้เเสดงออกโดยการใช้ ...
        
       
      })
// console.log('-----------44444444--------------')
//       console.log(productshop)
    
    // const product_shop = await ProductShops.create(updateStatus)
   
      
     
      return res.status(200).send({
        status: true,
        message: "เพิ่มสินค้าสำเร็จ",
        data: productshop,
      });
  } catch (error) {
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
}
exports.getStockById = async (req, res) => {
  try {
    const id = req.params.id;
    const mystock = await ProductShops.findOne({shop_id:id})
    return res.send(mystock)
  } catch (error) {
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.addProducts = async(req,res) =>{
  var chkOrderID = await order.find()
      try{
  var getPreproduct = await PreOrderProducts.find({_id:req.body._id});//ส่งค่ามาจากด้าน front end โดยใช้id
   
     console.log("Status : ", getPreproduct[0].status)
  //  console.log("Status : ", getPreproduct[0].status.length)
   var indexLast = getPreproduct[0].status.length - 1;
   var chk_status = getPreproduct[0].status[indexLast].name;
    console.log(chk_status)
  const teatid = await PreOrderProducts.find({id:req.body._id})
  // if(teatid.length > 0) {
  //     console.log("มีการสร้างไอดีนี้ไปแล้ว")
  //     return res.status(200).send({message: "มีการสร้างไอดีนี้ไปแล้ว"})
  // }
  // console.log("teatid", teatid )
  console.log(chk_status)
          if (chk_status == "ยืนยันการสั่งซื้อ") {
                      
                      let data = {
                              shop_id: req.body.shop_id,
                              invoice: req.body.invoice,
                              employee_name: req.body.employee_name,
                              product_name:req.body.product_name,
                              timestamps: Date.now()
                  
                            }
                             const createOrder = new order(data);
                             const createOrderData = await createOrder.save()

                             return res.status(200).send({message:" สำเร็จ"})

                  }
          
                  return res.status(500).send({message:"รายการนี้ยังไม่ได้ยืนยันการสั่งซื้อ"})


          
          //  const createOrder = new order(data);
          //  const createOrderData = await createOrder.save()
      }catch (error){
          console.error(error)
       res.status(500).send("ไม่สามารถเซฟได้")

      }
  }

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

exports.postPreorders = async(req,res) =>{
  try{
      const preorders = await PreOrderProducts.find({status:{$elemMatch:{name:'ยืนยันการสั่งซื้อ'}}})
      if(!preorders){
          res.send("ไม่เจอ")

      }
      console.log(preorders)
      res.send({
          
      })
      
  
  }catch(error){
      console.log(error)
   res.status(500).send("ไม่สามารถเซฟได้")
  }
}