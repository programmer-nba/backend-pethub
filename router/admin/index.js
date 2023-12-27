const router = require("express").Router();
const admins = require("../../controllers/admin/admin.controller.js");
const authAdmin = require("../../lib/auth.admin.js");
const product = require("../../controllers/product/product.shop.controller")
const productShops = require("../../controllers/product/product.shop.controller")
const member =require("../../controllers/member/member.controller")

router.post("/create",authAdmin, admins.create);
router.get("/",authAdmin, admins.getAdminAll);
router.get("/:id",authAdmin, admins.getAdminById);
router.put("/:id",authAdmin, admins.updateAdmin);
router.delete("/:id",authAdmin, admins.deleteAdmin);
router.get("/chack/MemberById/:id",authAdmin, admins.getMemberById)
router.get("/chack/MemberAll",authAdmin, admins.getMemberByAll)
router.delete("/DeletPackAndOne/:id",admins.DeletPackAndOne)
//router.post("/stock/:id", authAdmin, productShops.PreorderStock);
//router.get("/stock//:id", authAdmin, productShops.getStockById);



module.exports = router; 