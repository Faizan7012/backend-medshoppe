const expres = require("express");
const cors = require("cors");
const UserRoute = require("./routes/user.routes");
const ProductRoute = require("./routes/product.routes");
const CartRoute = require("./routes/cart.routes");
const OrderRoute = require("./routes/order.routes");
const { connect } = require("./config/db.config");
const app = expres()
app.use(cors())
app.use(expres.json())
app.use('/user',UserRoute)
app.use('/product',ProductRoute)
app.use('/cart',CartRoute)
app.use('/order',OrderRoute)


app.get('/',async(req,res)=>{
    res.send('welcome to home page')
})




app.listen(8080,async()=>{
    await connect();
    console.log(`listening on http://localhost:8080`)
})