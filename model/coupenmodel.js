const mongoose=require('mongoose')
const coupenSchema=mongoose.Schema({
   coupencode:{
    type:String,
   },
   min:{
    type:Number
   },
   max:{
      type:Number
     },
   to:{
    type:Date
   },
   discount:{
    type:Number
   },
   active:{
    type:Boolean,
    default:false
   },
   user:{type:Array}
})
module.exports=mongoose.model('coupencollection',coupenSchema)