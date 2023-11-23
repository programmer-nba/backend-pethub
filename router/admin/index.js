const router = require("express").Router();
const admins = require("../../controllers/admin/admin.controller.js");
const authAdmin = require("../../lib/auth.admin.js");
const product = require("../../controllers/product/product.shop.controller")

router.post("/create",authAdmin, admins.create);
router.get("/",authAdmin, admins.getAdminAll);
router.get("/:id",authAdmin, admins.getAdminById);
router.put("/:id",authAdmin, admins.updateAdmin);
router.delete("/:id",authAdmin, admins.deleteAdmin);
router.post("/addpreorderstock/:id",authAdmin, product.PreorderStock);
router.get("/product-shop/admin/:id",authAdmin, product.getStockById );

module.exports = router; 