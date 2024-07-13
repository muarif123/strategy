const { default: mongoose } = require("mongoose");

const options = new mongoose.Schema({
    mail:{
        type:String,
        required:true,
        unique:true
    },
    user:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model('options',options)