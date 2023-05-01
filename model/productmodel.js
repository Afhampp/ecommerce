const mongoose=require('mongoose')
const productSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    images:{
        type:Array,
        
        
    },
    brand:{
        type:String,
        required:true
    },
    is_verified:{
        type:Number,
        default:0
    },
    is_listed:{
        type:Boolean,
        default:false
    },
    categories:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'categoriescollection',
        required:true
    }
})
module.exports=mongoose.model('productcollection',productSchema)