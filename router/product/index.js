const router = require("express").Router();
const product = require("../../controllers/product/product.controller.js");
const authAdmin = require("../../lib/auth.admin.js");

router.post("/create",authAdmin , product.create);
router.get("/",authAdmin, product.getProductAll);
router.get("/:id",authAdmin, product.getProductById);
router.put("/:id",authAdmin, product.updateProduct);
router.delete("/:id",authAdmin, product.deleteProduct);

module.exports = router; 