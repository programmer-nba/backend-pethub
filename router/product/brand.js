const router = require("express").Router();
const band = require("../../controllers/product/band.controller.js");
const authAdmin = require("../../lib/auth.admin.js");


router.post("/createBand",band.createBand)
router.get("/getBandAll",band.getBandAll)
router.get("/getBandOne/:id",band.getBandById)
router.put("/updateBand/:id", band.updateband);
router.delete("/deleteband/:id",band.deleteband)

module.exports = router; 