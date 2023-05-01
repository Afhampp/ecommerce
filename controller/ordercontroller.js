const orderdb=require('../model/ordermodel')
const productdb=require('../model/productmodel')
const userdb=require('../model/usermodel')




const getorder=async(req,res)=>{
    try{
        const orderli=await orderdb.find()
        console.log(orderli)
        const orderlist = orderli.map(order => {
            const date = new Date(order.date);
            const dateString = date.toLocaleString();
            const address = order.address; // update address property
  const productinfo = order.productinfo; // update productinfo property
  return { ...order._doc, date: dateString, address, productinfo };
});
          console.log(orderlist)
        
        res.render('admin/adminorder',{adminheadlink:true,adminheader:true,orderlist,adminfooter:true})
    }
    catch(error){
        console.log(error);
        res.render("error");
    }
}
const getorderitem=async(req,res)=>{
    try{
        const orderid=req.query.id
        if(orderid){
       
        
        req.session.adminorder=orderid
        const orderlist=await orderdb.findById({_id:orderid})
        const x=await orderdb.aggregate([{$match: {_id: orderlist._id}},{$unwind:"$productinfo"}])
      
        
        res.render('admin/itemview',{adminheadlink:true,adminheader:true,x,adminfooter:true})
        }
        else{

            const orderid=req.session.adminorder
            const orderlist=await orderdb.findById({_id:orderid})
        const x=await orderdb.aggregate([{$match: {_id: orderlist._id}},{$unwind:"$productinfo"}])
       
        
        res.render('admin/itemview',{adminheadlink:true,adminheader:true,x,adminfooter:true})
        }
    }
    catch(error){
        console.log(error);
        res.render("error");
    }
}
const cancelled=async(req,res)=>{
    try{
        const id=req.query.id
        await orderdb.findByIdAndUpdate({_id:id},{$set:{is_cancelled:true}})
        const x=await orderdb.find({_id:id}) 
        console.log("ordercartcalue",x)
        const[{productinfo}]=x
        const productupdate=productinfo.map(({id,quantitypro})=>({
            id,
            quantitypro

        }))

        for(const y of productupdate){
            console.log(y.id)
            console.log(y.quantitypro)
           const products= await productdb.findByIdAndUpdate({_id:y.id},{$inc:{quantity:y.quantitypro}})
            console.log("ith updated products",products);
        }
        const orders=await orderdb.findOne({_id:id})
        if(orders.paymentmethod=="online payment"){
            const finduser=orders.user_id
            const total=orders.totalprice
            await userdb.updateOne({_id:finduser},{$inc:{wallet:total}})
        }
       
        res.redirect('/admin/getorderpage')
    }
    catch(error){
        console.log(error);
        res.render("error");
    }
}
const cancelleditem=async(req,res)=>{
    try{
        const productid=req.query.id
    
        const orderid=req.session.adminorder

        const orders=await orderdb.findById({_id:orderid})
        console.log(orders)
        const order = await orderdb.findOneAndUpdate(
            {_id: orderid, "productinfo._id": productid},
            {$set: {"productinfo.$.cancelitem": true}}
          
          );
          console.log("order........",order);
          const y=await orderdb.aggregate([{$match:{_id:orders._id}},{$unwind:"$productinfo"},{$match:{"productinfo.id":productid}}])

          const [{productinfo}]=y
  
        
         const x= await productdb.findOneAndUpdate({_id:productid},{$inc:{quantity:productinfo.quantitypro}})
         
          res.redirect('/admin/view')
    }
    catch(error){
        console.log(error);
        res.render("error");
    }
}
const complete=async(req,res)=>{
    try{
        const id=req.query.id
        const x=await orderdb.findByIdAndUpdate({_id:id},{$set:{is_complete:true}})
       
        res.redirect('/admin/getorderpage')
    }
    catch(error){
        console.log(error);
        res.render("error");
    }
}
const shipping=async(req,res)=>{
    try{
  
        const id=req.query.id
        const x=await orderdb.findByIdAndUpdate({_id:id},{$set:{shipping:true}})
 
        res.redirect('/admin/getorderpage')
    }
    catch(error){
        console.log(error);
        res.render("error");
    }
}

const accpetreturn=async(req,res)=>{
    try{
  
        const id=req.query.id
        const orderlist=await orderdb.findByIdAndUpdate({_id:id},{$set:{return:true}})
        const x=await orderdb.find({_id:id}) 
        console.log("ordercartcalue",x)
        const[{productinfo}]=x
        const productupdate=productinfo.map(({id,quantitypro})=>({
            id,
            quantitypro

        }))

        for(const y of productupdate){
            console.log(y.id)
            console.log(y.quantitypro)
           const products= await productdb.findByIdAndUpdate({_id:y.id},{$inc:{quantity:y.quantitypro}})
        }
        const finduser=orderlist.user_id
        const total=orderlist.totalprice
        await userdb.updateOne({_id:finduser},{$inc:{wallet:total}})
        res.redirect('/admin/getorderpage')
    }
    catch(error){
        console.log(error);
        res.render("error");
    }
}

const decline=async(req,res)=>{
    try{
  
        const id=req.query.id
        await orderdb.findByIdAndUpdate({_id:id},{$set:{returned:false,can_return:false,decline:true}})

        res.redirect('/admin/getorderpage')
    }
    catch(error){
        console.log(error);
        res.render("error");
    }
}


module.exports={
    getorder,
    getorderitem,
    cancelled,
    cancelleditem,
    complete,
    shipping,
    accpetreturn,
    decline
}