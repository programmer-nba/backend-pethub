const router = require("express").Router();
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/auth.admin");
const Product = require("../../controllers/product/product.controller");
const Category = require("../../controllers/product/category.controller")
const ProductShops = require("../../controllers/product/product.shop.controller");
const authCashier = require("../../lib/auth.cashier");
const shopping = require("../../controllers/shopping/shopping.controller.js")


router.get("/showproduct", shopping.findProductAll)
router.delete("/deleteproduct/:id",shopping.deleteProduct)
router.put("/cancel/:id",shopping.calcelProduct)
router.post("/preorder",shopping.preorder)
router.get("/ShowReceipt/:id",shopping.ShowReceiptById)
router.get("/ShowReceiptAll", authCashier,shopping.ShowReceiptAll)
router.get("/getbarcode/:shop_id/:barcode",shopping.getByBarcode)



module.exports = router;