const productdb=require('../model/productmodel')
const wishdb=require('../model/wishlistmodel')




//WISH LIST
const getwishlist = async (req, res) => {
    try {
     
      const usersession = req.session.user_id;
      const username = req.session.name;

      const checker = await wishdb.findOne({ 
        user_id: usersession, 
        'products.productid': { $exists: true } 
    }).populate("products.productid");

    if(checker){
      const block=false
      const wishlist = await wishdb.findOne({ user_id: usersession }).populate("products.product_id");
     
      const stocks = [];
      for (const x of wishlist.products) {
        const stock = await productdb.findOne({ _id: x.product_id._id });
        stocks.push(stock)
      
      }
        res.render('user/wishlist', { userheadlink: true, userheader: true,usersession,username,stocks,block, userfooter: true })
    }else{

      const block =true

      res.render('user/wishlist', { userheadlink: true, userheader: true,usersession,username,block, userfooter: true })
    }
     
      
    }
    catch (error) {
      res.render("error");
    }
  }
  
  
  
  
  
  
  
  const addwishlist=async(req,res)=>{
      try{
           const usersession=req.session.user_id
           
          const wishlist= await wishdb.findOne({user_id:usersession})
         if(wishlist){
          const findingproduct=await wishdb.findOne({user_id:usersession,"products.product_id":req.query.id})
          if(findingproduct){
              await wishdb.updateOne({user_id:usersession},{$pull:{products:{product_id:req.query.id}}})
              res.json({status:false})
          }else{
           
              await wishdb.findOneAndUpdate({user_id:usersession},{$addToSet:{products:{product_id:req.query.id}}})
              res.json({status:true})
          }
         }
         else{
          await wishdb.create([{user_id:usersession,products:{product_id:req.query.id}}])
          res.json({status:true})
          
         }
  
         
      }
      catch(error){
          res.render("error");
      }
  }
  const pullitem = async (req, res) => {
    try {
      
      const usersession=req.session.user_id
           
      const wishlist= await wishdb.findOne({user_id:usersession})
     if(wishlist){
      const findingproduct=await wishdb.findOne({user_id:usersession,"products.product_id":req.query.id})
      if(findingproduct){
          await wishdb.updateOne({user_id:usersession},{$pull:{products:{product_id:req.query.id}}})
          res.redirect('/getwishlist')
      
    }
  }
}
    catch (error) {
      res.render("error");
    }
  }

  module.exports={
    getwishlist,
    addwishlist,
    pullitem
  }