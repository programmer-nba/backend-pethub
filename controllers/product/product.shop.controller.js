const multer = require("multer");
const fs = require("fs");
const {
  ProductShops,
  validateProduct,
} = require("../../models/product/product.shop.model");
const {PreOrderProducts} = require("../../models/product/preorder.model");
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
      console.log(check);
      if (check.length === 0) {
        invoice_number =
          `PETHUB${dayjs(date).format("YYYYMMDD")}`.padEnd(15, "0") + num;
      }
    } while (check.length !== 0);
  } else {
    invoice_number = `PETHUB${dayjs(date).format("YYYYMMDD")}`.padEnd(15, "0") + "1";
  }
  console.log(invoice_number);
  return invoice_number;
}
