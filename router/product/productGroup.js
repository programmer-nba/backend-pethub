const router = require("express").Router();
const productgroup = require("../../controllers/product/productGroup.controller.js");
const authAdmin = require("../../lib/auth.admin.js");

router.post("/createproductgroup",productgroup.createSize)
router.get("/list/productgroup",productgroup.getSizeAll)
router.get("/list/productgroup/:id",productgroup.getSizeById)
router.put("/list/updateproductgroup/:id",productgroup.updateSize)
router.delete("/list/deleteproductgroup/:id",productgroup.deleteSize)

module.exports = router; 