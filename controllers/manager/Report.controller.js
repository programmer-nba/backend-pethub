const bcrypt = require("bcrypt");
const { Manager, validateManager } = require("../../models/user/manager.model");
const {
  Products,
  validateproduct,
} = require("../../models/product/product.model.js");
const {
  PreOrderProductShell,
} = require("../../models/product/preordershell.model.js");
const {
  Categorys,
  validatecategory,
} = require("../../models/product/category.model.js");
const { PreOrderProducts } = require("../../models/product/preorder.model");
const {
  ProductShops,
  validateProduct,
} = require("../../models/product/product.shop.model.js");
const {
  ProductShall,
  validateProductShall,
} = require("../../models/product/product.shall.model.js");
const { PackProducts } = require("../../models/product/productpack.model.js");
const { Promotion } = require("../../models/promotion/promotion.model.js");
const {
  preorder_shopping,
} = require("../../models/ิbuy_product/buyproduct.model.js");
const { Shops, validateShop } = require("../../models/shop/shop.model.js");
const { PciceCost } = require("../../models/report/report.price.cost.model.js");
const {ProditAndLoss} = require("../../models/report/report.profit_loss.model.js")
const dayjs = require("dayjs");

exports.GetPreOrderShopping = async (req, res) => {
  try {
    const order = await preorder_shopping.find();
    if (order) {
      return res.status(200).send({
        message: "ดึงข้อมูลรายการสั่งชื้อสินค้าสำเร็จ",
        status: true,
        data: order,
      });
    } else {
      return res.status(500).send({
        message: "ดึงข้อมูลรายการสั่งชื้อสินค้าไม่สำเร็จ",
        status: false,
      });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
exports.ReportPriceCost = async (req, res) => {
  try {
    const preorders = await preorder_shopping.find();
    const reportnumberValue = await reportnumber();
    const flattenedDetails = preorders.flatMap(
      (order) => order.customer_detail
    );
    const productDetails = {};
    flattenedDetails.forEach((detail) => {
      const product_id = detail.product_id;
      const name = detail.name;
      const price_cost = detail.price_cost;
      const amount = detail.amount;

      if (productDetails[product_id]) {
        productDetails[product_id].total_price_cost += price_cost * amount;
      } else {
        productDetails[product_id] = {
          product_id,
          name,
          total_price_cost: price_cost * amount,
        };
      }
    });
    const resultArray = Object.values(productDetails);
    await PciceCost.create({ reportnumber: reportnumberValue,product_costs: resultArray });
    return res.status(200).send({
      status: true,
      message: "รายงานราคาทุนสำเร็จ",
      data: resultArray,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "มีบางอย่างผิดพลาด",
      status: false,
      error: error.message,
    });
  }
};
exports.PeportProFitandLoss = async (req, res) => {
  try {
    const preorders = await preorder_shopping.find();
    const porfitnumbers = await porfitnumber();
    const flattenedDetails = preorders.flatMap(
      (order) => order.customer_detail
    );
    const productDetails = {};
    flattenedDetails.forEach((detail) => {
      const product_id = detail.product_id;
      const name = detail.name;
      const price_cost = detail.price_cost;
      const amount = detail.amount;
      const total = detail.total;
      if (!productDetails[product_id]) {
        productDetails[product_id] = {
          product_id,
          name,
          total_price_cost: 0,
          total: 0,
        };
      }
      productDetails[product_id].total_price_cost += price_cost * amount;
      productDetails[product_id].total += total;
      productDetails[product_id].profit_loss = productDetails[product_id].total - productDetails[product_id].total_price_cost;
    });
    const resultArray = Object.values(productDetails);
    await ProditAndLoss.create({ porfitnumber : porfitnumbers, product_costs: resultArray });
    return res.status(200).send({
      status: true,
      message: "รายงานกำไร-ขาดทุนสำเร็จ",
      data: resultArray,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "มีบางอย่างผิดพลาด",
      status: false,
      error: error.message,
    });
  }
};
exports.ClosetheTops = async (req,res) =>{
  
};
exports.GetReportAllPriceCost = async (req, res) =>{
  try {
    const manager = await PciceCost.find();
    console.log("..............test...........")
    if (manager) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลราคาตุนทุนทั้งหมดสำเร็จ",
        data: manager,
      });
    } else {
      return res.status(404).send({message: "ไม่พบข้อมูลราคาตุนทุน", status: false});
    }
  } catch (err) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
}
exports.GetReportAllPriceCostById = async (req, res) =>{
  try {
    const id = req.params.id
    const manager = await PciceCost.findById(id);
    console.log("..............test...........")
    if (manager) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลราคาตุนทุนทั้งหมดสำเร็จ",
        data: manager,
      });
    } else {
      return res.status(404).send({message: "ไม่พบข้อมูลราคาตุนทุนทั้งหมด", status: false});
    }
  } catch (err) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
}
//ใบเสร็จกำไรขาดทุน
exports.ProditAndLossAll = async (req, res) =>{
  try {
    const manager = await ProditAndLoss.find();
    if (manager) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลใบเสร็จกำไรขาดทุนทั้งหมดสำเร็จ",
        data: manager,
      });
    } else {
      return res.status(404).send({message: "ไม่พบข้อมูลใบเสร็จกำไรขาดทุนทั้งหมด", status: false});
    }
  } catch (err) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
}
exports.GetProditAndLossById = async (req, res) =>{
  try {
    const id = req.params.id
    const manager = await ProditAndLoss.findById(id);
    if (manager) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลใบเสร็จกำไรขาดทุนทั้งหมดสำเร็จ",
        data: manager,
      });
    } else {
      return res.status(404).send({message: "ไม่พบข้อมูลใบเสร็จกำไรขาดทุนทั้งหมด", status: false});
    }
  } catch (err) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
}
async function reportnumber(date) {
  const order = await PciceCost.find();
  let reportnumber = null;
  if (order.length !== 0) {
    let data = "";
    let num = 0;
    let check = null;
    do {
      num = num + 1;
      data = `REPORT${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + num;
      check = await PciceCost.find({reportnumber: data});
      if (check.length === 0) {
        reportnumber =
          `REPORT${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + num;
      }
    } while (check.length !== 0);
  } else {
    reportnumber =
      `REPORT${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + "1";
  }
  return reportnumber;
}
async function porfitnumber(date) {
  const order = await ProditAndLoss.find();
  let porfitnumber = null;
  if (order.length !== 0) {
    let data = "";
    let num = 0;
    let check = null;
    do {
      num = num + 1;
      data = `PORFIT${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + num;
      check = await ProditAndLoss.find({porfitnumber: data});
      if (check.length === 0) {
        porfitnumber =
          `PORFIT${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + num;
      }
    } while (check.length !== 0);
  } else {
    porfitnumber =
      `PORFIT${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + "1";
  }
  return porfitnumber;
}
