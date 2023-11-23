const router = require("express").Router();
const Order = require("../../controllers/order/order.controller.js");
const authAdmin = require("../../lib/auth.admin.js");




router.post("/order", Order.postPreorder);

router.post("/addproducts", Order.addProducts)





module.exports = router; 
