const mongoose=require('mongoose')
const wishlistSchema=mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'usercollection',
        required:true
    },
  
    products:[{
        product_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'productcollection',
        }
       
       
}]
})
module.exports=mongoose.model('wishlistcollection',wishlistSchema)