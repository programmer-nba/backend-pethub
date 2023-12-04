  const {Cashier , validateCashier} = require("../../models/user/cashier.model");
  const bcrypt = require("bcrypt");
  const dayjs = require("dayjs");
  const {PreOrderProducts} = require("../../models/product/preorder.model");
  const {PreOrderProductShell}= require("../../models/product/preordershell.model")
  
  
  exports.create = async (req, res) => {
    try {
        const {error} = validateCashier(req.body);
      if (error)
        return res
          .status(400)
          .send({message: error.details[0].message, status: false});
  
      const user = await Cashier.findOne({
        cashier_username: req.body.cashier_username,
      });
      if (user)
        return res.status(409).send({
          status: false,
          message: "มีชื่อผู้ใช้งานนี้ในระบบเเล้ว",
        });
  
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.cashier_password, salt);
      const date = dayjs(Date.now()).format("");

      const result = await new Cashier({
        ...req.body,
        cashier_password: hashPassword,
        cashier_date_start: date,
      }).save();
      res
        .status(201)
        .send({message: "สร้างข้อมูลสำเร็จ", status: true, result: result});
    } catch (error) {
     res.status(500).send({message: error.message , status: false});
    }
  };
  