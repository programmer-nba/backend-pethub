  const {Cashier , validateCashier} = require("../../models/user/cashier.model");
  const bcrypt = require("bcrypt");
  const dayjs = require("dayjs");
  const {PreOrderProducts} = require("../../models/product/preorder.model");
  const {PreOrderProductShell}= require("../../models/product/preordershell.model")
  const {ProductShops} = require("../../models/product/product.shop.model.js")
  const {Member}= require("../../models/user/member.model")
  const {typeMember} = require("../../models/user/type.model")
  const {Categorys} = require("../../models/product/category.model.js")
  const {ReturnProductShall} = require("../../models/product/return.product.shell.model.js")
  
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

 exports.findOneCashier = async (req, res) => {
    try {
      const id = req.params.id;
      const cashier = await Cashier.findById(id);
      if (cashier) {
        return res.status(200).send({
          status: true,
          message: "ดึงข้อมูลพนักงานสำเร็จ",
          data: cashier,
        });
      } else {
        return res.status(404).send({message: "ไม่พบพนักงาน", status: false});
      }
    } catch (error) {
      res.status(500).send({
        message: "มีบางอย่างผิดพลาด",
        status: false,
      });
    }
  };

  exports.findAllCashiire = async (req, res) => {
    try {
      const cashierShopId = req.params.id;
      const cashier = await Cashier.find({ cashier_shop_id: cashierShopId });
  
      if (cashier.length > 0) {
        return res.status(200).send({
          status: true,
          message: "ดึงข้อมูลพนักงานสำเร็จ",
          data: cashier,
        });
      } else {
        return res.status(404).send({ message: "ไม่พบพนักงาน", status: false });
      }
    } catch (error) {
      res.status(500).send({
        message: "มีบางอย่างผิดพลาด",
        status: false,
      });
    }
  };
  
  

  exports.updateCashier = async (req, res) => {
    try {
      if (!req.body) {
        return res.status(400).send({
          message: "ส่งข้อมูลผิดพลาด",
        });
      }
      const id = req.params.id;
      if (!req.body.cashier_password) {
        const cashier = await Cashier.findByIdAndUpdate(id, req.body);
        if (cashier) {
          if (product) {
            return res
              .status(200)
              .send({message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว", status: true});
          } else {
            return res
              .status(500)
              .send({message: "ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้", status: false});
          }
        }
      } else {
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.cashier_password, salt);
        const cashier = await Cashier.findByIdAndUpdate(id, {
          ...req.body,
          cashier_password: hashPassword,
        });
        if (cashier) {
          return res
            .status(200)
            .send({message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว", status: true});
        } else {
          return res
            .status(500)
            .send({message: "ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้", status: false});
        }
      }
    } catch (error) {
      res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
    }
  };

  exports.deleteCashier= async (req, res) => {
    try {
      const id = req.params.id;
      const cashier = await Cashier.findByIdAndDelete(id);
      if (!cashier) {
        return res
          .status(404)
          .send({status: false, message: "ไม่พบข้อมูลพนักงาน"});
      } else {
        return res
          .status(200)
          .send({status: true, message: "ลบข้อมูลพนักงานสำเร็จ"});
      }
    } catch (err) {
      return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
    }
  };

  exports.getCashierAll = async (req,res) =>{
    try {
      const cashier = await Cashier.find();
      if (cashier) {
        return res.status(200).send({
          status: true,
          message: "ดึงข้อมูลพนักงานสำเร็จ",
          data: cashier,
        });
      } else {
        return res.status(404).send({message: "ไม่พบพนักงาน", status: false});
      }
    } catch (err) {
      res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
    }
  }
  
  exports.updateTypemember = async (req, res) => {
    try {
      const phoneNumber = req.params.member_phone;
      const update_typemember = await Member.findOneAndUpdate(
        { member_phone: phoneNumber },
        { $set: { member_type: req.body.member_type } },
        { new: true }
      );
  
      if (!update_typemember) {
        return res.status(404).send({ status: false, message: "ไม่พบสมาชิกที่ตรงกับหมายเลขโทรศัพท์ที่ระบุ" });
      }
      
      console.log(update_typemember);
  
      return res.status(200).send({ status: true, message: "อัปเดตประเภทลูกค้าสำเร็จ" });
    } catch (error) {
      console.log(error);
      res.status(500).send("ไม่สามารถอัปเดตได้");
    }
};

  exports.deleteType = async(req,res) =>{
  try {
    const id = req.params.id;
    const member = await typeMember.findByIdAndDelete(id);
    if (!member) {
      return res
        .status(404)
        .send({status: false, message: "ไม่พบข้อมูลประเภทลูกค้า"});
    } else {
      return res
        .status(200)
        .send({status: true, message: "ลบข้อมูลประเภทสินค้าสำเร็จ"});
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
}

exports.getCategoryAllChs = async (req, res) => {
  try {
    const category = await Categorys.find();
    if (category) {
      return res
        .status(200)
        .send({message: "ดึงประเภทสินค้าสำเร็จ", status: true, data: category});
    } else {
      return res
        .status(500)
        .send({message: "ดึงประเภทสินค้าไม่สำเร็จ", status: false});
    }
  } catch (err) {
    return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
  }
};

exports.getDetailsProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const preorder_list = await PreOrderProductShell.findOne({ ordernumbershell: id });
    if (preorder_list) {
      // ตัวอย่างการแสดงข้อมูล product_detail เฉพาะ
      const product_detail = preorder_list.product_detail;
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลรายการสั่งซื้อสำเร็จ",
        product_detail,
      });
    } else {
      return res.status(500).send({
        message: "มีบางอย่างผิดพลาด",
        status: false,
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: "มีบางอย่างผิดพลาด",
      status: false,
    });
  }
};

exports.findAllTypemember = async (req,res) =>{
  try {
    const member = await typeMember.find();
    if (member) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลประเภทลูกค้าสำเร็จ",
        data: member,
      });
    } else {
      return res.status(404).send({message: "ไม่พบข้อมูลประเภทลูกค้า", status: false});
    }
  } catch (err) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
}

exports.UpdateProductAmount = async (req,res) =>{
  try {
    const ordernumbershell = req.params.id // เปลี่ยน id เป็น ordernumber
    const productCount = await PreOrderProductShell.findOne({ "ordernumbershell": ordernumbershell });
    if (!productCount) {
      return res.status(400).send({ message: "กรุณากรอก ordernumber ก่อน", status: false });
    }
    const productDetails = req.body.product_detail;
    console.log("จำนวนสินค้าที่ต้องการอัพเดดใหม่:", productDetails);
    const productIds = productDetails.map(product => product.product_id);

    for (let product of productDetails) {
      const result = await PreOrderProductShell.updateMany(
        { "ordernumbershell": ordernumbershell, "product_detail.product_id": product.product_id },
        { $set: { "product_detail.$.product_amount": product.product_amount } }
      );
      if (result.nModified === 0) {
        return res.status(404).send({
          message: "ไม่พบข้อมูลสินค้าที่ต้องการแก้ไขหรือข้อมูลสินค้านั้นอาจจะไม่ถูกอัปเดต",
          status: false
        });
      }
    }
    return res.status(200).send({ message: "แก้ไขข้อมูลสินค้าสำเร็จ", status: true });
  } catch (err) {
    console.error(err);
    ret
}

}


exports.ProductReturn = async (req, res) => {
  try {
    const ordernumbershell = req.params.id;
    const productDetailsToRemove = req.body.product_detail;
    if (!productDetailsToRemove || !productDetailsToRemove.length) {
      return res.status(400).send({
        message: "กรุณาระบุรายละเอียดสินค้าที่ต้องการส่งคืน",
        status: false,
      });
    }
  
    const preorder = await PreOrderProductShell.findOne({ ordernumbershell: ordernumbershell });
    if (!preorder) {
      return res.status(500).send({
        message: "ไม่พบข้อมูลสินค้าจากการส่งกลับ",
        status: false,
      });
    }
    const deletedProducts = [];
    let returnProductData = {
      ordernumbershell: preorder.ordernumbershell,
      product_detail: [],
    };
    for (const removedProduct of productDetailsToRemove) {
      const additionalProductInfo = await ProductShops.findOne({ product_id: removedProduct.product_id });
      const updatedProductDetail = preorder.product_detail.filter(product =>
        product.product_id == removedProduct.product_id
      );
      const product_amount = updatedProductDetail[0].product_amount;
      const returnProductInfo = {
        product_id: removedProduct.product_id, 
        barcode: additionalProductInfo.barcode,
        price_cost: additionalProductInfo.price_cost,
        product_name: additionalProductInfo.name,
        product_amount: product_amount,
        product_logo: additionalProductInfo.logo,
      };
      const returnProduct = new ReturnProductShall(returnProductInfo);
      await returnProduct.save();
      deletedProducts.push({
        ...returnProductInfo,
      });
    }
    await PreOrderProductShell.updateOne(
      { ordernumbershell: ordernumbershell },
      { $pull: { product_detail: { product_id: { $in: productDetailsToRemove.map(p => p.product_id) } } } }
    );    
    await ProductShops.deleteMany({ _id: { $in: productDetailsToRemove.map(p => p.product_id) } });
    return res.status(200).send({
      status: true,
      message: "ลบสินค้าสำเร็จ",
      deletedProducts: deletedProducts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: error.message,
      status: false,
    });
  }
};

exports.fildAllProducShalltReturn = async (req, res) => {
  try {
    const employee = await ReturnProductShall.find();
    if (employee) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลรายการส่งคืนสินค้าสำเร็จ",
        data: employee,
      });
    } else {
      return res.status(404).send({message: "ไม่พบรายการส่งคืนสินค้า", status: false});
    }
  } catch (err) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.fildOneProducShalltReturn = async (req, res) => {
  try {
    const id = req.params.id
    const employee = await ReturnProductShall.findById(id);
    if (employee) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลรายการส่งคืนสินค้าสำเร็จ",
        data: employee,
      });
    } else {
      return res.status(404).send({message: "ไม่พบรายการส่งคืนสินค้า", status: false});
    }
  } catch (err) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};
