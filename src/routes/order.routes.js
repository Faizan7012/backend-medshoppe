const express = require("express");
const OrderRoute = express.Router();
const cors = require("cors");
const { getOrder, deleteOrder, shippingSuccess, packingSuccess, deliverSuccess, createOrder, getSingleOrder, getOrderDataForUser } = require("../controller/order.controller");
const { orderTokenCheck } = require("../middlewares/order.auth");
const checkToken = require("../middlewares/user.middleware");
OrderRoute.use(cors());


OrderRoute.get('/',orderTokenCheck,async(req,res)=>{
  let ans = await getOrder();
  res.send(ans)
})


OrderRoute.delete('/cancel/:id',orderTokenCheck,async(req,res)=>{
    let ans = await deleteOrder(req.params.id);
    res.send(ans)
})

OrderRoute.patch('/shipped/:id',async(req,res)=>{
    let ans = await shippingSuccess(req.params.id);
    res.send(ans)
})


OrderRoute.patch('/packed/:id',orderTokenCheck,async(req,res)=>{
    let ans = await packingSuccess(req.params.id);
    res.send(ans)
})

OrderRoute.patch('/delivered/:id',orderTokenCheck ,async(req,res)=>{
    let ans = await deliverSuccess(req.params.id);
    res.send(ans)
})
OrderRoute.get('/:id',orderTokenCheck ,async(req,res)=>{
    let ans = await getSingleOrder(req.params.id);
    res.send(ans)
})

OrderRoute.post('/create',checkToken,async(req,res)=>{
    const {id,details,totalBill,paymentType} = req.body
    let ans = await createOrder(id,totalBill,details,paymentType);
    res.send(ans)
})

OrderRoute.get('/user',checkToken, async(req,res)=>{
    const {id} = req.body
    let ans = await getOrderDataForUser(id);
    res.send(ans)
})

module.exports = OrderRoute


