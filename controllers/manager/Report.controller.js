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
exports.ReportPriceCost  = async (req,res) =>{
    console.log("test...")
    try {
        const orders = await preorder_shopping.find();
        let productCostMap = new Map();
    
        orders.forEach(order => {
          order.customer_detail.forEach(product => {
            const productId = product.product_id;
            const productCost = product.price_cost * product.amount;
    
            if (productCostMap.has(productId)) {
              productCostMap.set(productId, productCostMap.get(productId) + productCost);
            } else {
              productCostMap.set(productId, productCost);
            }
          });
        });
        // สร้าง Object จาก Map โดยให้ product_costs เป็น Array ของ Object
        const product_costs = Array.from(productCostMap, ([product_id, totalCost]) => ({ product_id, totalCost }));
        console.log(product_costs)
        const reportPriceCost = new PciceCost({
            product_costs: product_costs
          });
      
          await reportPriceCost.save();
    
        return res.status(200).send({
          message: "ดึงข้อมูลรายการสั่งชื้อสินค้าสำเร็จ",
          status: true,
          data: {
            product_costs: product_costs,
          },
        });
    
      } catch (err) {
        console.error(err);
        return res.status(500).send({
          status: false,
          message: "มีบางอย่างผิดพลาด",
          error: err.message,
        });
      }
};






