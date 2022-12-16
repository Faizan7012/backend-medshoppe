const transporter = require("../config/mail");
const cartModel = require("../model/cart.model");
const orderModel = require("../model/order.model");
const productModel = require("../model/product.model");

const getOrder = async()=>{
    try{
        let data = await  orderModel.find().populate(['userID','orderData.productID'])

        if(data.length == 0){
            return {
                status:false,
                massage : 'you dont have any order'
            }
        }
        else{
            return {
                status:true,
                massage : 'order data fetched successfully',
                data
            }
        }
    }
    catch(e){
        return {
            status:false,
            massage : e.message
        }
    }
}

const getSingleOrder = async(id)=>{
    try{
        let data = await  orderModel.find({id}).populate(['userID','productID'])

        if(data.length == 0){
            return {
                status:false,
                massage : 'you dont have any order'
            }
        }
        else{
            return {
                status:true,
                massage : 'single order data fetched successfully',
                data
            }
        }
    }
    catch(e){
        return {
            status:false,
            massage : e.message
        }
    }
}



const deleteOrder = async(id)=>{
    try{

        let deleted = await orderModel.deleteOne({id});

        if(deleted.acknowledged){
            return {
                status:true,
                massage : 'order daleted successfully',
            }
        }
        else{
            return {
                status:false,
                massage : 'something went wrong please try again later !'
            }
        }
    }
    catch(e){
        return {
            status:false,
            massage : e.message
        }   
     }


}

const packingSuccess = async(id)=>{
    try{

        let findData = await orderModel.find({id})
        if(findData.length > 0){

            let updatedData = await orderModel.findByIdAndUpdate(findData[0]._id,{ 'packed': !findData[0].packed }) 
            if(updatedData.userID){
                return {
                    status:true,
                    massage : 'order packed changed successfully',
                }
            }
            else{
                return {
                    status:false,
                    massage : 'something went wrong please try again later !'
                }
            }
        }
        else{
            return {
                status:false,
                massage : 'something went wrong please try again later !'
            }
        }

    }
    catch(e){
        return {
            status:false,
            massage : e.message
        }   
     }
}

const shippingSuccess = async(id)=>{
    try{

        let findData = await orderModel.find({id})
        if(findData.length > 0){

            let updatedData = await orderModel.findByIdAndUpdate(findData[0]._id,{ 'shipped': !findData[0].shipped }) 
                 console.log(updatedData)
            if(updatedData.userID){
                return {
                    status:true,
                    massage : 'order shipped changed successfully',
                }
            }
            else{
                return {
                    status:false,
                    massage : 'something went wrong please try again later !'
                }
            }
        }
        else{
            return {
                status:false,
                massage : 'something went wrong please try again later !'
            }
        }

    }
    catch(e){
        return {
            status:false,
            massage : e.message
        }   
     }
}


const deliverSuccess = async(id)=>{
    try{
        let findData = await orderModel.find({id})
        if(findData.length > 0){

            let updatedData = await orderModel.findByIdAndUpdate(findData[0]._id,{ 'delivered': !findData[0].delivered }) 
            if(updatedData.userID){
                return {
                    status:true,
                    massage : 'order delivered changed successfully',
                }
            }
            else{
                return {
                    status:false,
                    massage : 'something went wrong please try again later !'
                }
            }
        }
        else{
            return {
                status:false,
                massage : 'something went wrong please try again later !'
            }
        }

    }
    catch(e){
        return {
            status:false,
            massage : e.message
        }   
     }
}



const createOrder = async(userID,totalBill,details,paymentType)=>{
    try{
    let findData = await cartModel.find({userID:userID},{_id : 0 , __v : 0}).populate(['userID','productID'])
        if(findData.length > 0){
              let orderDatalist = await orderModel.create({
                   userID,
                   totalBill,
                   paymentType,
                   userDetails:details,
                   orderData:findData
                })

            if(!orderDatalist.userID){
                return {
                    status:false,
                    massage : 'something went wrong please try again later !'
                }
            }
            else{
                findData.forEach((ele)=>{
                    totalBill += ele.quantity * ele.productID.mrp
                    productModel.findByIdAndUpdate(
                           ele.productID._id,
                        { quantity: ele.productID.quantity - ele.quantity }
                      )
                   }) 
                await cartModel.deleteMany({userID:userID})
                transporter.sendMail({
                    to:findData[0].userID.email,
                    from:'medshoppe5@gmail.com',
                    subject:'order submitted',
                    html : `<h4>Hello ${findData[0].userID.username}</h4><br /><br /><p>Your order from MedShoppe has been submited successfull</p><br /><br />
                            <p>Total bill : ${totalBill}</p> <br />
                            <p>OrderId : ${orderDatalist._id} </p><br /><br />
                            <p>Thanks for choosing us </p>
                             `
                })
                return {
                    status:true,
                    massage : 'order submitted successfully',
                }
            }
        }
        else{
            return {
                status:false,
                massage : 'something went wrong please try again later !'
            }
        }

    }
    catch(e){
        return {
            status:false,
            massage : e.message
        }   
     }

}


const getOrderDataForUser = async(userID)=>{
    try{
        let data = await  orderModel.find({userID}).populate('productID')
        if(!data){
            return {
                status:false,
                massage : 'you dont have any order'
            }
        }
        else{
            return {
                status:true,
                massage : 'single order data fetched successfully',
                data
            }
        }
    }
    catch(e){
        return {
            status:false,
            massage : e.message
        }
    }
}

module.exports = {getOrder,deleteOrder,packingSuccess,shippingSuccess,deliverSuccess , createOrder , getSingleOrder , getOrderDataForUser}