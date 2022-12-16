const express = require("express");
const ProductRoute = express.Router();
const cors = require("cors");
const {getProduct,updateProduct,deleteProduct,updateQuantity,createProduct,getOneProduct, getSearchProduct, getDataAdmin} = require('../controller/product.controller');
const { orderTokenCheck } = require("../middlewares/order.auth");
ProductRoute.use(cors());

ProductRoute.get('/',async(req,res)=>{
    const {limit , page, category , sort , low ,high} = req.query;
    let ans = await getProduct(limit , page, category , sort , low ,high);
    res.send(ans)
})
ProductRoute.get('/:id',async(req,res)=>{
    const id = req.params.id
    let ans = await getOneProduct(id)
    res.send(ans)
})
ProductRoute.get('/admin/prod',async(req,res)=>{
    const {limit,page} = req.query
    let ans = await getDataAdmin(limit,page)
    res.send(ans)
})

ProductRoute.post('/', orderTokenCheck,async(req,res)=>{
    let newProduct = req.body;
    let ans = await createProduct(newProduct)
    res.send(ans)
    
})

ProductRoute.patch('/:id',orderTokenCheck,async(req,res)=>{
    let newProduct = req.body;
    const {id} = req.params;
    let ans = await updateProduct(id,newProduct);
    res.send(ans);
})

ProductRoute.delete('/:id', orderTokenCheck ,async(req,res)=>{
    const {id} = req.params;
    let ans = await deleteProduct(id);
    res.send(ans);
})


ProductRoute.patch('/update/:id', orderTokenCheck ,async(req,res)=>{
    const {id} = req.params;
    const {val} = req.body;
    let ans = await updateQuantity(id,val);
    res.send(ans);
})

ProductRoute.get('/search/prod',async(req,res)=>{
    const {q ,limit , page ,sort , high ,low } = req.query;
    let ans = await getSearchProduct(q,limit,page,low,high,sort);
    res.send(ans)
})


module.exports = ProductRoute