const expres = require("express");
const cors = require("cors");
const UserRoute = require("./routes/user.routes");
const ProductRoute = require("./routes/product.routes");
const CartRoute = require("./routes/cart.routes");
const OrderRoute = require("./routes/order.routes");
const { connect } = require("./config/db.config");
const productModel = require("./model/product.model");
const orderModel = require("./model/order.model");
const userModel = require("./model/user.model");
const app = expres();
app.use(cors())
app.use(expres.json())
app.use('/user',UserRoute)
app.use('/product',ProductRoute)
app.use('/cart',CartRoute)
app.use('/order',OrderRoute)


app.get('/',async(req,res)=>{
    res.send('welcome to home page')
})

app.get('/all',async(req,res)=>{
        try{
            let ans1 = await productModel.aggregate([{$group:{_id : '$instock' , total : {$sum : '$quantity'}}}]);
            let ans2 = await orderModel.aggregate([{$group:{_id : '$delivered' , total : {$sum : '$quantity'}}}]);
            let ans3 = await userModel.aggregate([{$group:{_id : '$userType' , total : {$count : {}}}}]);
            res.send({
                status:true,
                data:{
                    product:ans1,
                    order:ans2,
                    user:ans3
                }
            })
        }
        catch(e){
            res.send({
                status:false,
                message: e.message
            })
        }
})



app.listen(8080,async()=>{
    await connect();
    console.log(`listening on http://localhost:8080`)
})