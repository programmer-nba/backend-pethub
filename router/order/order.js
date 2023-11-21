const router = require("express").Router();
const Order = require("../../controllers/order/order.controller.js");
const authAdmin = require("../../lib/auth.admin.js");



router.post("/order",authAdmin,Order.getOrder);


module.exports = router; 
