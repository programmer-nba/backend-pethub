const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const order = require("../../models/order/order.model");
const {Admins, validateAdmin} = require("../../models/user/admin.model");


// exports.create = async(req,res) =>{
//     try{
//         console.log(req,body)
//     //const {name} =req.body;
//         const Order = await new Order({req,body}).save();
//         res.send(Order)

//     }catch(err){
//         res.status(500).send("ไม่สามารถเซฟได้")
//     }
// }
module.exports.getOrder = async(req,res) =>{
        try{
            let saveData = {
                order_id: "1",
                name : "warunyoo"
            }
            


            // const result = await new Order({
            //     ...req.body,
            //     employee_password: hashPassword,
            //     employee_date_start: date,
            //   }).save();

              
              
            const saveOrder = await order(saveData)
            const saveOrderData = await saveOrder.save()
            res.send(saveOrderData)
           
            
    
        }catch(error){
            console.log(error)
         res.status(500).send("ไม่สามารถเซฟได้")
        }
    }