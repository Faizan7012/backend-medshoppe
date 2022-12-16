const express = require("express");
const CartRoute = express.Router();
const cors = require("cors");
const cartModel = require("../model/cart.model");
const checkToken = require("../middlewares/user.middleware");
CartRoute.use(cors());
CartRoute.use(checkToken);

// Post Request
CartRoute.post("/items", async (req, res) => {
  try {
    const allCartItems = await cartModel.find({
      userID: req.body.id,
      productID: req.body.productID,
    }).populate("productID");
    if (allCartItems.length >= 1 ) {
      const UpdatedCart = await cartModel.findByIdAndUpdate(
        allCartItems[0]._id,
        { quantity: allCartItems[0].quantity + 1 }
      );
      res.status(200).json({
        newItem_added: UpdatedCart,
      });
    } else {
      const cartItems = await cartModel.create({userID:req.body.id,productID:req.body.productID});
      if (cartItems) {
        res.status(201).json({
          newItem_added: cartItems,
        });
      } else {
        res.status(404).json({
          message: "Error in request",
        });
      }
    }
  } catch (error) {
    res.status(404).json({
      message: error,
    });
  }
});

// Get Request
CartRoute.get("/", async (req, res) => {
  try {
    const cartItems = await cartModel.find();
    if (cartItems) {
      res.status(200).json({
        cartItems: cartItems,
      });
    } else {
      res.status(404).json({
        cartItems: "No Cart Items Found",
      });
    }
  } catch (error) {
    res.status(404).json({
      error: error,
    });
  }
});

CartRoute.put("/items",async(req,res)=>{
  try {
    const allCartItems = await cartModel.find({
      userID: req.body.id,
      productID: req.body.productID,
    });
    if (allCartItems.length >= 1) {
      const UpdatedCart = await cartModel.findByIdAndUpdate(
        allCartItems[0]._id,
        { quantity: allCartItems[0].quantity - 1 }
      );
      res.status(200).json({
        newItem_added: UpdatedCart
      });
    } else {
      res.status(404).json({
        message: "This product not exists"
      })
    }
  } catch (error) {
    res.status(404).json({
      message: error,
    });
  }
})

// Get Cart Items from user ID
CartRoute.get("/items", async (req, res) => {
  try {
    const cartItems = await cartModel
      .find({ userID: req.body.id })
      .populate({ path: "productID" });
    if (cartItems.length >= 1) {
      let total = 0;
      for (var i = 0; i < cartItems.length; i++) {
        total += cartItems[i].productID.mrp * cartItems[i].quantity;
      }
      res.status(200).json({
        cartItems: cartItems,
        totalPayment: total,
      });
    } else {
      res.status(404).json({
        cartItems: "No CartItems Found from this userID",
      });
    }
  } catch (error) {
    res.status(404).json({
      error: error,
    });
  }
});

// Delete by Cart id
CartRoute.delete("/items/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const cartItems = await cartModel.findByIdAndDelete(id);
    if (cartItems) {
      res.status(200).json({
        message: "Cart Item Deleted SuccessFully",
      });
    } else {
      res.status(404).json({
        message: "ID Not Found",
      });
    }
  } catch (error) {
    res.status(404).json({
      error: "ID Not Found",
    });
  }
});

module.exports = CartRoute;
