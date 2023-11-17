const router = require("express").Router();
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/auth.admin");
const Product = require("../../controllers/product/product.controller");
const Category = require("../../controllers/product/category.controller")
const ProductShops = require("../../controllers/product/product.shop.controller");

router.post("/", auth, ProductShops.create);
router.get("/", auth, Product.getProductAll);
router.get("/category", auth, Category.getCategoryAll);

router.get("/shop-id/:id", auth, ProductShops.findByShopId);

//admin
router.get("/admin/shop-id/:id", authAdmin, ProductShops.findByShopId);

//preorder
router.post("/preorder", auth, ProductShops.preorderProduct);
router.get("/preorder", auth, ProductShops.getPreorderAll);
router.get("/preorder/admin", authAdmin, ProductShops.getPreorderAll);
router.get("/preorder/:id", auth, ProductShops.getPreorderById);
router.get("/preorder/admin/:id", authAdmin, ProductShops.getPreorderById);

//confrim
router.put("/preorder/admin/confirm/:id", authAdmin, ProductShops.confirmPreorder);
//cancel
router.put("/preorder/admin/cancel/:id", authAdmin, ProductShops.cancelPreorder);

module.exports = router;