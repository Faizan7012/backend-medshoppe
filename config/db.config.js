const mongoose = require('mongoose');
const connect = async()=>{
    return mongoose.connect('mongodb+srv://medshoppe:medshoppe@cluster0.lfujmad.mongodb.net/medshoppe?retryWrites=true&w=majority')
}

module.exports = {connect}