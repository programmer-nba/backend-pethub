const router = require("express").Router();
const cashier = require("../../controllers/cashier/cashier.controller");
const auth = require("../../lib/auth");
const authAdmin= require("../../lib/auth.admin");
const product = require("../../controllers/product/product.shop.controller")
const ProductShops = require("../../controllers/product/product.shop.controller");
const authCashier = require("../../lib/auth.cashier")
const member =require("../../controllers/member/member.controller")



router.post("/" ,authCashier, member.create);
router.get("/:id",authCashier, member.findOneMember)
router.put("/updatemember/:id",authCashier,member.updateMember)
router.delete("/deleteMember/:id",authCashier,member.deleteMember)


router.post("/addTypemember", member.createTypeMember)
router.get("/getmember/typememberAll",authAdmin, member.findTypemember)
router.get("/getmember/typememberBy/:id" ,authAdmin,member.findOneTypeMember)
router.put("/editTypeMember/:id",authAdmin,member.updateTypeMember )
router.delete("/deleteTypeMember/:id",authAdmin,member.deleteTypeMember)



module.exports = router; 