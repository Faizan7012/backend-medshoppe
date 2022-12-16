const mongoose = require("mongoose");

cartItemSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
    },
    quantity : {type:Number,default:1}
},{
    versionKey:false,
    timestamps:true
});
module.exports = mongoose.model("cart", cartItemSchema);
