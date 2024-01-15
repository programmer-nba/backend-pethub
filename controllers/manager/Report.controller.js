const bcrypt = require("bcrypt");
const {Manager,validateManager} = require("../../models/user/manager.model")
const {Products,validateproduct} = require("../../models/product/product.model.js")
const {
  PreOrderProductShell,
} = require("../../models/product/preordershell.model.js");
const {Categorys,validatecategory} = require("../../models/product/category.model.js")
const {PreOrderProducts} = require("../../models/product/preorder.model");
const {ProductShops,validateProduct} = require("../../models/product/product.shop.model.js")
const {ProductShall,validateProductShall} =require("../../models/product/product.shall.model.js")
const {PackProducts} = require("../../models/product/productpack.model.js")
const {Promotion} = require("../../models/promotion/promotion.model.js")
const {preorder_shopping} = require("../../models/ิbuy_product/buyproduct.model.js")
const {Shops,validateShop} =require("../../models/shop/shop.model.js")
const {PciceCost} = require("../../models/report/report.price.cost.model.js")
const dayjs = require("dayjs");


exports.GetPreOrderShopping  = async (req,res) =>{
  try {
    const order = await preorder_shopping.find();
    if (order) {
      return res
        .status(200)
        .send({message: "ดึงข้อมูลรายการสั่งชื้อสินค้าสำเร็จ", status: true, data: order});
    } else {
      return res
        .status(500)
        .send({message: "ดึงข้อมูลรายการสั่งชื้อสินค้าไม่สำเร็จ", status: false});
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};
exports.ReportPriceCost = async (req, res) => {
    try {
        const preorders = await preorder_shopping.find();
        console.log(preorders);

        // สร้าง array เพื่อเก็บข้อมูลจาก customer_detail
        const customerDetails = [];
        preorders.forEach(order => {
            customerDetails.push(order.customer_detail);
        });

        return res.status(200).send({
            status: true,
            message: "รายงานราคาทุนสำเร็จ",
            data: customerDetails,
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














