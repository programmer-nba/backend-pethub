const router = require("express").Router();
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/auth.admin");
const ProductShops = require("../../controllers/product/product.shop.controller");

router.post("/", auth, ProductShops.create);
router.get("/", auth, ProductShops.getProductAll);
router.get("/shop-id/:id", ProductShops.findByShopId);

//admin
router.get("/admin/shop-id/:id", authAdmin, ProductShops.findByShopId)

module.exports = router;