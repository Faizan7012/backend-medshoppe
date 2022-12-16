const mongoose = require('mongoose');
require('dotenv').config();

const connect = async()=>{
    return mongoose.connect(process.env.MONGO_URL)
}

module.exports = {connect}