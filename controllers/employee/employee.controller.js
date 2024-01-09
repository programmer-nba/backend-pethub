const {
  Employees,
  validateEmployee,
} = require("../../models/user/employee.model");
const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const {PreOrderProducts} = require("../../models/product/preorder.model");
const {PackProducts} = require("../../models/product/productpack.model")
const {ReturnProduct} = require("../../models/product/return.product.model")
const {Products} = require("../../models/product/product.model")
const {ReturnProductShall} = require("../../models/product/return.product.shell.model")

exports.fildAll = async (req, res) => {
  try {
    const employee = await Employees.find();
    if (employee) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลพนักงานสำเร็จ",
        data: employee,
      });
    } else {
      return res.status(404).send({message: "ไม่พบพนักงาน", status: false});
    }
  } catch (err) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.findByShopId = async (req, res) => {
  try {
    const id = req.params.id;
    const employee = await Employees.find({employee_shop_id: id});
    if (employee) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลพนักงานสำเร็จ",
        data: employee,
      });
    } else {
      return res.status(404).send({message: "ไม่พบพนักงาน", status: false});
    }
  } catch (err) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const employee = await Employees.findById(id);
    if (employee) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลพนักงานสำเร็จ",
        data: employee,
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

exports.create = async (req, res) => {
  try {
    const {error} = validateEmployee(req.body);
    if (error)
      return res
        .status(400)
        .send({message: error.details[0].message, status: false});

    const user = await Employees.findOne({
      employee_username: req.body.employee_username,
    });
    if (user)
      return res.status(409).send({
        status: false,
        message: "มีชื่อผู้ใช้งานนี้ในระบบเเล้ว",
      });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.employee_password, salt);
    const date = dayjs(Date.now()).format("");
    const result = await new Employees({
      ...req.body,
      employee_password: hashPassword,
      employee_date_start: date,
    }).save();
    res
      .status(201)
      .send({message: "สร้างข้อมูลสำเร็จ", status: true, result: result});
  } catch (error) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const employee = await Employees.findByIdAndDelete(id);
    if (!employee) {
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

exports.calcelEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const updateStatus = await PreOrderProducts.findOne({_id: id});
    console.log(updateStatus);
    if (updateStatus) {
      updateStatus.status.push({
        name: "ยกเลิกการสั่งซื้อ",
        timestamps: dayjs(Date.now()).format(""),
      });
      updateStatus.save();
      return res.status(200).send({
        status: true,
        message: "ยกเลิกการสั่งซื้อสำเร็จ",
        data: updateStatus,
      });
    } else {
      return res.status(500).send({
        message: "มีบางอย่างผิดพลาด",
        status: false,
      });
    }
  } catch (error) {
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};
exports.confirmEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const updateStatus = await PreOrderProducts.findOne({_id: id});
    console.log(updateStatus);
    if (updateStatus) {
      updateStatus.status.push({
        name: "ยืนยันการสั่งซื้อ",
        timestamps: dayjs(Date.now()).format(""),
      });
      updateStatus.save();
      return res.status(200).send({
        status: true,
        message: "ยืนยันการสั่งซื้อสำเร็จ",
        data: updateStatus,
      });
    } else {
      return res.status(500).send({
        message: "มีบางอย่างผิดพลาด",
        status: false,
      });
    }
  } catch (error) {
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.update = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({
        message: "ส่งข้อมูลผิดพลาด",
      });
    }
    const id = req.params.id;
    if (!req.body.employee_password) {
      const employee = await Employees.findByIdAndUpdate(id, req.body);
      if (employee) {
        if (employee) {
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
      const hashPassword = await bcrypt.hash(req.body.employee_password, salt);
      const employee = await Employees.findByIdAndUpdate(id, {
        ...req.body,
        employee_password: hashPassword,
      });
      if (employee) {
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

exports.fildAllProductPack = async (req, res) => {
  try {
    const id = req.body._id
    const product = await PackProducts.find({shop_id:id});
    console.log(product)
    if (product) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลสินค้าเป็นเเพ็คสำเร็จ",
        data: product,
      });
    } else {
      return res.status(404).send({message: "ไม่มีสินค้าแบบเป็นเเพ็ค",  status: false});
    }
  } catch (err) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};
//25/12/2566 นำสินค้าส่งคืนแบบทั้งหมด
exports.Productback = async (req, res) => {
  try {
    const ordernumber = req.params.id;
    const productDetailsToRemove = req.body.product_detail;
    // ตรวจสอบว่ามีรายละเอียดสินค้าที่ต้องการลบหรือไม่
    if (!productDetailsToRemove || !productDetailsToRemove.length) {
      return res.status(400).send({
        message: "กรุณาระบุรายละเอียดสินค้าที่ต้องการส่งคืน",
        status: false,
      });
    }
    const preorder = await PreOrderProducts.findOne({ ordernumber: ordernumber });
    if (!preorder) {
      return res.status(500).send({
        message: "ไม่พบข้อมูลสินค้าจากการส่งกลับ",
        status: false,
      });
    }
    const productdetail =  preorder.product_detail
    const findreturn = productdetail.filter((item)=> item.product_id == req.body.product_detail[0].product_id)
    console.log(preorder)
    //บันทึกข้อมูลส่งสินค้ากลับ
    const returnProductInfo = new ReturnProduct({
      product_id: findreturn[0].product_id, 
      product_name: findreturn[0].product_name,
      product_amount: req.body.product_detail[0].product_amount, 
      product_logo: findreturn[0].product_logo,
      barcode:findreturn[0].barcode
    });
    const add = await returnProductInfo.save(); 
    // //ลบจำนวนที่หาย
    const dataedit ={
      product_id: findreturn[0].product_id, 
      product_name: findreturn[0].product_name,
      product_amount: findreturn[0].product_amount -req.body.product_detail[0].product_amount, 
      product_logo: findreturn[0].product_logo,
      barcode:findreturn[0].barcode
    }
    const filerpreorder = preorder.product_detail.filter((item)=> item.product_id != req.body.product_detail[0].product_id)
    if(findreturn[0].product_amount -req.body.product_detail[0].product_amount>0)
    {
      filerpreorder.push(dataedit)
    }
    await PreOrderProducts.updateOne(
      { ordernumber: ordernumber },
      { product_detail: filerpreorder}
    );
    return res.status(200).send({
      status: true,
      message: "ลบสินค้าสำเร็จ",
      data:filerpreorder
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: error.message,
      status: false,
    });
  }
};


exports.fildAllProductReturn = async (req, res) => {
  try {
    const employee = await ReturnProduct.find();
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


exports.fildOneProductReturn = async (req, res) => {
  try {
    const id = req.params.id
    const employee = await ReturnProduct.findById(id);
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

exports.confirmProductReturn = async (req,res) =>{
  try {
    const id = req.params.id;
    const updateStatus = await ReturnProductShall.findOne({_id: id});
    console.log(updateStatus);
    if (updateStatus) {
      updateStatus.status.push({
        name: "ยืนยันการส่งสินค้าคืน",
        timestamps: dayjs(Date.now()).format(""),
      });
      updateStatus.save();
      return res.status(200).send({
        status: true,
        message: "ส่งสืนค้าคืนสำเร็จ",
        data: updateStatus,
      });
    } else {
      return res.status(500).send({
        message: "มีบางอย่างผิดพลาด",
        status: false,
      });
    }
  } catch (error) {
    return res.status(500).send({message: error.message, status: false});
  }
}

exports.fildAllProducShalltReturnShop = async (req, res) => {
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










