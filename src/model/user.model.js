const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: { type: String},
  username: { type: String, required: true},
  password : {type:String,required:true},
  email: { type: String, required: true,unique:true,match:
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ },
  userType:{type:String,enum:["user","admin"],default:"user"}
});

const userModel = model("user", userSchema);

module.exports = userModel;