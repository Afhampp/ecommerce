const mongoose=require('mongoose')
const adminSchema=mongoose.Schema({
    admin:{
        type:String,
        required:true
    },
 
    password:{
        type:String,
        required:true
    },
   images:{
        type:String,
       
    },
    adminwallet:{
        type:Number,
       default:0
    },
})
module.exports=mongoose.model('admincollection',adminSchema)