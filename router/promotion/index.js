const router = require("express").Router();
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/auth.admin");
const Product = require("../../controllers/product/product.controller");
const Category = require("../../controllers/product/category.controller")
const ProductShops = require("../../controllers/product/product.shop.controller");
const authCashier = require("../../lib/auth.cashier");
const shopping = require("../../controllers/shopping/shopping.controller.js")
const promotion = require("../../controllers/promotion/promotion.controller.js")



router.post("/PromotionPercen/:id", promotion.PromotionPercen)
router.get("/PromotionPercenAll",promotion.PromotionfildAll)


module.exports = router;