const mongoose=require('mongoose')
const orderSchema=mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'usercollection',
        required:true
    },
    productinfo: [{
        id:{type:String},
        name: { type: String, required: true },
        stock: { type: Number, required: true },
        quantitypro: { type: Number, required: true },
        tprice: { type: Number, required: true },
        cancelitem: { type: Boolean, required: true },
      }],
    address:{
        type:Array
    },
    totalprice:{
        type:Number
    },

    date:{
        type: Date,
        required: true,
    },
    is_cancelled:{
        type: Boolean,
        default:false
        
    },
    is_complete:{
        type: Boolean,
        default:false
        
    },
    shipping:{
        type: Boolean,
        default:false
        
    },
    can_return:{
        type: Boolean,
        default:false
        
    },
    return:{
        type: Boolean,
        default:false
        
    },
    decline:{
        type: Boolean,
        default:false
        
    },
    paymentmethod:{
        type:String,
    }


})
module.exports=mongoose.model('odercollection',orderSchema)