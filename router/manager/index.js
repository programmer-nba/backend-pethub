const router = require("express").Router();
const authManager = require("../../lib/auth.manager")
const authAdmin = require("../../lib/auth.manager")
const manager = require("../../controllers/manager/manager.controller")


router.post("/create",authManager,manager.create);

module.exports = router; 