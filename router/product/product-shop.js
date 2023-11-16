const router = require("express").Router();
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/auth.admin");
const Product = require("../../controllers/product/product.controller");
const Category = require("../../controllers/product/category.controller")
const ProductShops = require("../../controllers/product/product.shop.controller");

router.post("/", auth, ProductShops.create);
router.get("/", auth, Product.getProductAll);
router.get("/category", auth, Category.getCategoryAll);
// router.get("/", auth, ProductShops.getProductAll);
router.get("/shop-id/:id", auth, ProductShops.findByShopId);

//admin
router.get("/admin/shop-id/:id", authAdmin, ProductShops.findByShopId);

//preorder
router.post("/preorder", auth, ProductShops.preorderProduct);
router.get("/preorder", auth, ProductShops.getPreorderAll);
router.get("/preorder/:id", auth, ProductShops.getPreorderById);

module.exports = router;