const bcrypt = require("bcrypt");
const {Manager,validateManager} = require("../../models/user/manager.model")
const {Products,validateproduct} = require("../../models/product/product.model.js")
const {
  PreOrderProductShell,
} = require("../../models/product/preordershell.model.js");
const {PreOrderProducts} = require("../../models/product/preorder.model");
const dayjs = require("dayjs");




exports.create = async (req, res) => {
    try {
      const {error} = validateManager(req.body);
      if (error) {
        return res
          .status(400)
          .send({status: false, message: error.details[0].message});
      }
      const user = await Manager.findOne({
        manager_username: req.body.manager_username,
      });
      if (user) {
        return res.status(400).send({
          status: false,
          message: "มีชื่อผู้ใช้งานนี้ในระบบเเล้ว",
        });
      } else {
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.manager_password, salt);
        await new Manager({
          ...req.body,
          manager_password: hashPassword,
        }).save();
        return res.status(200).send({message: "สร้างข้อมูลสำเร็จ", status: true});
      }
    } catch (err) {
      return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
    }
  };

exports.fildManagerAll = async (req, res) => {
 
    try {
      const manager = await Manager.find();
      console.log("..............test...........")
      if (manager) {
        return res.status(200).send({
          status: true,
          message: "ดึงข้อมูลผู้จัดการสำเร็จ",
          data: manager,
        });
      } else {
        return res.status(404).send({message: "ไม่พบผู้จัดการ", status: false});
      }
    } catch (err) {
      res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
    }
  };

exports.fildManagerOne = async (req, res) => {
    try {
      const id = req.params.id
      const manager = await Manager.findById(id);
      if (manager) {
        return res.status(200).send({
          status: true,
          message: "ดึงข้อมูลผู้จัดการสำเร็จ",
          data: manager,
        });
      } else {
        return res.status(404).send({message: "ไม่พบผู้จัดการ", status: false});
      }
    } catch (err) {
      res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
    }
  };

  exports.updateManager = async (req, res) => {
    try {
      if (!req.body) {
        return res.status(400).send({
          message: "ส่งข้อมูลผิดพลาด",
        });
      }
      const id = req.params.id;
      if (!req.body.manager_password) {
        const manager = await Manager.findByIdAndUpdate(id, req.body);
        if (manager) {
          if (manager) {
            return res
              .status(200)
              .send({message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว", status: true});
          } else {
            return res
              .status(500)
              .send({message: "ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้", status: false});
          }
        }
      } else {
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.manager_password, salt);
        const manager = await Manager.findByIdAndUpdate(id, {
          ...req.body,
          manager_password: hashPassword,
        });
        if (manager) {
          return res
            .status(200)
            .send({message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว", status: true});
        } else {
          return res
            .status(500)
            .send({message: "ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้", status: false});
        }
      }
    } catch (error) {
      res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
    }
  };

  exports.deleteManager = async (req, res) => {
    try {
      const id = req.params.id;
      const manager = await Manager.findByIdAndDelete(id);
      if (!manager) {
        return res
          .status(404)
          .send({status: false, message: "ไม่พบข้อมูลผู้จัดการ"});
      } else {
        return res
          .status(200)
          .send({status: true, message: "ลบข้อมูลผู้จัดการสำเร็จ"});
      }
    } catch (err) {
      return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
    }
  };

  exports.preorderManager = async (req, res) => {
    console.log(req.body);
    try {
      const { product_detail } = req.body;
      const { product_id, product_amount } = product_detail[0];
      console.log(product_detail)
      
      // ทำตรวจสอบจำนวนสินค้าที่มีอยู่ โดยใช้ตรวจสอบจากฐานข้อมูลเช่นกัน
      const availableProduct = await Products.findOne({ _id: product_id });
      if (!availableProduct || product_amount > availableProduct.quantity) {
        return res.status(400).send({
          status: false,
          message: "สินค้าไม่พอสำหรับการสั่งชื้อ",
        });
      }
      
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
  exports.getPreorderAllManager = async (req, res) => {
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
  exports.getPreorderByIdManager = async (req, res) => {
    try {
      const shopId = req.params.id;
      const preorderList = await PreOrderProducts.find({ shop_id: shopId });
  
      if (preorderList && preorderList.length > 0) {
        return res.status(200).send({
          status: true,
          message: "ดึงข้อมูลรายการสั่งซื้อสำเร็จ",
          data: preorderList,
        });
      } else {
        return res.status(404).send({
          message: "ไม่พบข้อมูลรายการสั่งซื้อสำหรับ shop_id ที่ระบุ",
          status: false,
        });
      }
    } catch (error) {
      return res.status(500).send({
        message: "มีบางอย่างผิดพลาดในการดึงข้อมูล",
        status: false,
      });
    }
  }
  exports.candelPreorderManager = async (req, res) => {
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