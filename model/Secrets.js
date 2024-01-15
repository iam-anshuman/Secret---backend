const mongoose = require('mongoose');

const secretSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    }
},{timestamps:true});

const Secrets = mongoose.model("secrets",secretSchema);

module.exports = Secrets;