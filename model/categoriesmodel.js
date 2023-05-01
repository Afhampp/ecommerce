const mongoose=require('mongoose')
const categoriesSchema=mongoose.Schema({
    categories:{
        type:String,
        required:true
    },
    is_list:{
        type:Boolean,
        default:false
    },
 
})
module.exports=mongoose.model('categoriescollection',categoriesSchema)