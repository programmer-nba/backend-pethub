const router = require("express").Router();
const band = require("../../controllers/product/band.controller.js");
const authAdmin = require("../../lib/auth.admin.js");


router.post("/createBand",authAdmin, band.createBand)
router.get("/getBandAll",authAdmin, band.getBandAll)
router.get("/getBandOne/:id",authAdmin, band.getBandById)
router.put("/updateBand/:id",authAdmin, band.updateband);
router.delete("/deleteband/:id",authAdmin, band.deleteband)

module.exports = router; 