const router = require("express").Router();
const cashier = require("../../controllers/cashier/cashier.controller");
const auth = require("../../lib/auth");
const authAdmin= require("../../lib/auth.admin");
const product = require("../../controllers/product/product.shop.controller")
const ProductShops = require("../../controllers/product/product.shop.controller");
const authCashier = require("../../lib/auth.cashier")
const member =require("../../controllers/member/member.controller")


router.post("/", member.create);
router.get("/:id", member.findOneMember)
router.put("/updatemember/:id",member.updateMember)




module.exports = router; 