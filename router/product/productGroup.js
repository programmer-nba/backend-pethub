const router = require("express").Router();
const productgroup = require("../../controllers/product/productGroup.controller.js");
const authAdmin = require("../../lib/auth.admin.js");

router.post("/createproductgroup",authAdmin, productgroup.createSize)
router.get("/list/productgroup",authAdmin,productgroup.getSizeAll)
router.get("/list/productgroup/:id",authAdmin, productgroup.getSizeById)
router.put("/list/updateproductgroup/:id",authAdmin, productgroup.updateSize)
router.delete("/list/deleteproductgroup/:id",authAdmin, productgroup.deleteSize)

module.exports = router; 