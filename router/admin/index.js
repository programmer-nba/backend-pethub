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
router.delete("/DeletPackAndOne/:id",authAdmin, admins.DeletPackAndOne)
router.put("/confirmRTProduct/:id",authAdmin,admins.confirmRTProduct)
//router.post("/stock/:id", authAdmin, productShops.PreorderStock);
//router.get("/stock//:id", authAdmin, productShops.getStockById);

router.get("/ProductReturn/admin",authAdmin , admins.fildAllProductReturnAdmin)
router.get("/ProductReturnfindOne/admin/:id",authAdmin,admins.fildOneProductReturnAdmin)

router.get("/ProductReturnShall/admin",authAdmin , admins.fildAllProductReturnShallAdmin)
router.get("/ProductReturnShallfindOne/admin/:id",authAdmin,admins.fildOneProductReturnShallAdmin)

module.exports = router; 