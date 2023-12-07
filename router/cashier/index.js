const router = require("express").Router();
const cashier = require("../../controllers/cashier/cashier.controller");
const auth = require("../../lib/auth");
const authAdmin= require("../../lib/auth.admin");
const product = require("../../controllers/product/product.shop.controller")
const ProductShops = require("../../controllers/product/product.shop.controller");
const authCashier = require("../../lib/auth.cashier")



router.post("/", authAdmin, cashier.create);
router.get("/getcashier/:id", authAdmin, cashier.findOneCashier);
router.get("/showcashierall",authAdmin, cashier.getCashierAll);
router.put("/edit/:id", authCashier, cashier.updateCashier);
router.delete("/delete/:id",authAdmin, cashier.deleteCashier );


module.exports = router; 