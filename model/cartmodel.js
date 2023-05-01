const mongoose=require('mongoose')
const cartSchema=mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'usercollection',
        required:true
    },
  
    products:[{
        productid:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'productcollection',
        },
        quantitypro:{
            type:Number,
            default:1
        },
        tprice:{
            type:Number,
        },
        cancelitem:{
            type:Boolean,
            default:false
        },
        
       
       
       
    }],
    totalprice:{
        type:Number
    },
    outstock:{
        type:Boolean,
        default:false
    }
})
module.exports=mongoose.model('cartcollection',cartSchema)