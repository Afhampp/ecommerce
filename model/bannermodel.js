const mongoose=require('mongoose')
const bannerSchema=mongoose.Schema({
    images:{
        type:String,
        required:true
    },
    view:{
        type:Boolean,
        default:true
       
    },
 
})
module.exports=mongoose.model('bannercollection',bannerSchema)