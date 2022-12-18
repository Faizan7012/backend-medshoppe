const productModel = require("../model/product.model");
const createProduct = async(newProduct)=>{
    try{
        let created = await productModel.create(newProduct);
        if(created.title){
        return {
                status:true,
                massage:'Product added sucessfully'
            }
        }
        else{
         return {
             status:false,
             massage:'Something went wrong please try again later !'
         }
        }
      }
      catch(e){
        return {
            status:false,
            massage:e.message
        }
    }
}


const getProduct = async(limit , page, category , sort , low ,high)=>{
    try{
        let findData = await productModel.find().limit(limit).skip((page-1)*limit);
        if(category){
            findData = await productModel.find({ancestor : category}).limit(limit).skip((page-1)*limit)
            
            if(low){
                findData = await productModel.find({ancestor : category , mrp:{$lte : low}}).limit(limit).skip((page-1)*limit)
            }
            if(high){
                findData = await productModel.find({ancestor : category , mrp:{$gte : high}}).limit(limit).skip((page-1)*limit)
            }
          if(sort){
          let orderBy = sort=='asc'?1:-1;

         findData = await productModel.find({ancestor : category}).limit(limit).skip((page-1)*limit).sort({mrp:orderBy})
          if(low){
         findData = await productModel.find({ancestor : category , mrp:{$lte : low}}).limit(limit).skip((page-1)*limit).sort({mrp:orderBy})
        }
        else if(high){
            findData = await productModel.find({ancestor : category , mrp:{$gte : high}}).limit(limit).skip((page-1)*limit).sort({mrp:orderBy})
       }
           }
        }
        else{

            if(low){
                findData = await productModel.find({mrp:{$lte : low}}).limit(limit).skip((page-1)*limit)
            }
            if(high){
                findData = await productModel.find({mrp:{$gte : high}}).limit(limit).skip((page-1)*limit)
            }
            if(sort){
                let orderBy = sort=='asc'?1:-1;
               findData = await productModel.find().limit(limit).skip((page-1)*limit).sort({mrp:orderBy})
                if(low){
                findData = await productModel.find({mrp:{$lte : low}}).limit(limit).skip((page-1)*limit).sort({mrp:sort=='asc'?1:-1})
                }
                else if(high){
                    findData = await productModel.find({mrp:{$gte : high}}).limit(limit).skip((page-1)*limit).sort({mrp:sort=='asc'?1:-1})
                }
              
            }

        }

        if(findData.length > 0){
        return {
                status:true,
                massage:'Product data fetched sucessfully',
                data : findData,
            }
        }
        else{
         return {
             status:false,
             massage:'Something went wrong please try again later !'
         }
        }
      }
      catch(e){
        return {
            status:false,
            massage:e.message
        }
    }
}
const getOneProduct = async(id)=>{
    try{
        let findData = await productModel.find({_id:id});
        if(findData.length == 0 ){
            return {
                status:false,
                massage:'Something went wrong please try again later !'
            }
        }
        else{
            return {
                status:true,
                massage:'Product data fetched sucessfully',
                data : findData
            }
        }
      }
      catch(e){
        return {
            status:false,
            massage:e.message
        }
    }
}




const updateProduct = async(id,newData)=>{
    try{
        let isPresent = await productModel.find({_id:id});
        if(isPresent.length > 0){
            let updatedData = await productModel.findByIdAndUpdate(isPresent[0].id,{
                title : newData.title,
                mrp:newData.mrp,
                quantity : newData.quantity,
                ancestor : newData.ancestor,
                brand : newData.brand,
                strike : newData.strike,
                instock : newData.instock,
                img1 : newData.img1,
                img2 : newData.img2,
                img3 : newData.img3
            });
            if(updatedData){
            return {
                    status:true,
                    massage:'Product updated sucessfully',
                }
            }
            else{
             return {
                 status:false,
                 massage:'Something went wrong please try again later !'
             }
            }
        }

        else{
            return {
                status:false,
                massage:'Product Not found with this id'
            }
        }
      
      }
      catch(e){
        return {
            status:false,
            massage:e.message
        }
      }
}

const deleteProduct = async(id)=>{
    try{
        let deletedData = await productModel.deleteOne({_id:id});
        if(deletedData.acknowledged){
        return {
                status:true,
                massage:'Product deleted sucessfully',
            }
        }
        else{
         return {
             status:false,
             massage:'Something went wrong please try again later !'
         }
        }
      }
      catch(e){
        return {
            status:false,
            massage:e.message
        }
      }
}

const updateQuantity = async(id,val)=>{
    try{
        let isPresent = await productModel.find({_id:id});
        if(isPresent.length >0){
        let updateQuantityData = await productModel.findByIdAndUpdate(isPresent[0]._id,
         { quantity: isPresent[0].quantity + val }) 
        if(updateQuantityData.acknowledged){
        return {
                status:true,
                massage:'Product Quantity updated sucessfully'
             }
        }
        }
        else{
         return {
             status:false,
             massage:'Something went wrong please try again later !'
         }
        }
      }
      catch(e){
        return {
            status:false,
            massage:e.message
        }
      }
}

const getSearchProduct = async(q,limit,page,low,high,sort)=>{
    try{
       let findData = await productModel.find().limit(limit).skip((page-1)*limit);

        if(q){
         findData = await productModel.find({title: { $regex: new RegExp(`${q}`), $options: "i" }}).limit(limit).skip((page-1)*limit);
            if(low){
                findData = await productModel.find({title: { $regex: new RegExp(`${q}`), $options: "i" },mrp:{$lte : low}}).limit(limit).skip((page-1)*limit)
            }
            if(high){
                findData = await productModel.find({title: { $regex: new RegExp(`${q}`), $options: "i" } ,mrp:{$gte : high}}).limit(limit).skip((page-1)*limit)
            }
          if(sort){
          let orderBy = sort=='asc'?1:-1;

         findData = await productModel.find({title: { $regex: new RegExp(`${q}`), $options: "i" }}).limit(limit).skip((page-1)*limit).sort({mrp:orderBy})
          if(low){
         findData = await productModel.find({title: { $regex: new RegExp(`${q}`), $options: "i" },mrp:{$lte : low}}).limit(limit).skip((page-1)*limit).sort({mrp:orderBy})
        }
        else if(high){
            findData = await productModel.find({title: { $regex: new RegExp(`${q}`), $options: "i" },mrp:{$gte : high}}).limit(limit).skip((page-1)*limit).sort({mrp:orderBy})
           }
        }
       }
        else{
            findData = await productModel.find().limit(limit).skip((page-1)*limit);
            if(low){
                findData = await productModel.find({mrp:{$lte : low}}).limit(limit).skip((page-1)*limit)
            }
            if(high){
                findData = await productModel.find({mrp:{$gte : high}}).limit(limit).skip((page-1)*limit)
            }
            if(sort){
                let orderBy = sort=='asc'?1:-1;
               findData = await productModel.find().limit(limit).skip((page-1)*limit).sort({mrp:orderBy})
                if(low){
                findData = await productModel.find({mrp:{$lte : low}}).limit(limit).skip((page-1)*limit).sort({mrp:sort=='asc'?1:-1})
                }
                else if(high){
                    findData = await productModel.find({mrp:{$gte : high}}).limit(limit).skip((page-1)*limit).sort({mrp:sort=='asc'?1:-1})
                }
              
            }

        }

        if(findData.length > 0){
        return {
                status:true,
                massage:'Product data fetched sucessfully',
                data : findData
            }
        }
        else{
         return {
             status:false,
             massage:'Something went wrong please try again later !'
         }
        }
      }
      catch(e){
        return {
            status:false,
            massage:e.message
        }
    }
}

const getDataAdmin = async(limit , page)=>{
    try{
        let Data = await productModel.find().limit(limit).skip((page - 1)*limit).sort({quantity:1})
        return {
                status:true,
                massage:'Product data fetched sucessfully',
                data:Data
             }      
        }
      catch(e){
        return {
            status:false,
            massage:e.message
        }
      }
}


module.exports = {getProduct,updateProduct,deleteProduct,updateQuantity,createProduct , getOneProduct ,getSearchProduct , getDataAdmin};