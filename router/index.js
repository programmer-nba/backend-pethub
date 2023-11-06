const router = require("express").Router();
const bcrypt = require("bcrypt");
const auth = require("../lib/auth.js");
require("dotenv").config();

const {Admins} = require("../models/user/admin.model.js");

router.post("/login", async (req, res) => {
  try {
    let admin = await Admins.findOne({
      admin_username: req.body.username,
    });
    if (!admin) {
      console.log("ไม่ใช่แอดมิน");
    } else {
      const validPasswordAdmin = await bcrypt.compare(
        req.body.password,
        admin.admin_password
      );
      if (!validPasswordAdmin) {
        return res.status(401).send({
          status: false,
          message: "password is not find",
        });
      }
      const token = admin.generateAuthToken();
      const ResponesData = {
        name: admin.admin_name,
        username: admin.admin_username,
        position: admin.admin_position,
      };
      if (token) {
        return res.status(200).send({
          status: true,
          token: token,
          message: "เข้าสู่ระบบสำเร็จ",
          result: ResponesData,
          level: "admin",
        });
      } else {
        return res.status(401).send({
          status: false,
          message: "เข้าสู่ระบบไม่สำเร็จ",
        });
      }
    }
  } catch (err) {
    return res
      .status(500)
      .send({status: false, message: "Internal Server Error"});
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const {decoded} = req;
    if (decoded && decoded.row === "admin") {
      const id = decoded._id;
      Admins.findOne({_id: id})
        .then((item) => {
          return res.status(200).send({
            name: item.admin_name,
            username: item.admin_username,
            level: "admin",
            position: item.admin_position,
          });
        })
        .catch(() =>
          res.status(400).send({message: "มีบางอย่างผิดพลาด", status: false})
        );
    }
  } catch (error) {
    res.status(500).send({message: "Internal Server Error", status: false});
  }
});

module.exports = router;
