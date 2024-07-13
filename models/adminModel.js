const { default: mongoose } = require("mongoose");

const admin = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"admin"

    }
})
module.exports = mongoose.model('admin',admin)