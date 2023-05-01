const productdb=require('../model/productmodel')
const wishdb=require('../model/wishlistmodel')




//WISH LIST
const getwishlist = async (req, res) => {
    try {
      const usersession = req.session.user_id;
      const wishlist = await wishdb.findOne({ user_id: usersession }).populate("products.product_id");
     
      const stocks = [];
      for (const x of wishlist.products) {
        const stock = await productdb.findOne({ _id: x.product_id._id });
        console.log(stock)
        stocks.push(stock)
      
      }
        res.render('user/wishlist', { userheadlink: true, userheader: true,usersession,stocks, userfooter: true })
      
    }
    catch (error) {
      console.log(error);
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
          console.log("created")
          res.json({status:true})
          
         }
  
         
      }
      catch(error){
          console.log(error);
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
      console.log(error);
      res.render("error");
    }
  }

  module.exports={
    getwishlist,
    addwishlist,
    pullitem
  }