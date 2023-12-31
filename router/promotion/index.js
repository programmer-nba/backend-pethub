const router = require("express").Router();
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/auth.admin");
const Product = require("../../controllers/product/product.controller");
const Category = require("../../controllers/product/category.controller")
const ProductShops = require("../../controllers/product/product.shop.controller");
const authCashier = require("../../lib/auth.cashier");
const shopping = require("../../controllers/shopping/shopping.controller.js")
const promotion = require("../../controllers/promotion/promotion.controller.js")



router.post("/PromotionPercen/:id", promotion.PromotionPercen)//สร้างส่วนลดเป็นเปอร์เซ็น
router.post("/PromotionFree",promotion.Promotionbyfree) //สร้างโปรโมชั่นแบบเเถม
router.get("/PromotionPercenAll",promotion.PromotionfildAll)
router.get("/PromotionFreeAll",promotion.PromotionfildfreeAll)
router.get("/PromotionfindId/:id",promotion.PromotionfindId)

module.exports = router;