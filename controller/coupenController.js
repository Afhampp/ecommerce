const coupendb=require('../model/coupenmodel')
const moment=require('moment')

const coupenpage=async(req,res)=>{
    try{
        const added=await coupendb.find().sort({  active: -1,to:-1})
        for(const x of added){
            if(x.to<new Date()){
                const check=await coupendb.findOneAndUpdate({_id:x.id},{$set:{active:false}})
            }
        }
        res.render('admin/coupen',{adminheadlink:true,adminheader:true,added,adminfooter:true})     
    }
    catch(error){
        res.render("error");
    }
}

const getaddpage=async(req,res)=>{
    try{
  
        res.render('admin/addcoupen',{adminheadlink:true,adminheader:true,adminfooter:true})     
    }
    catch(error){
        res.render("error");
    }
}
const postcoupen=async(req,res)=>{
    try{
        const{code,min,to,discount}=req.body
        const data={
            coupencode:code,
            min:min,
            to:to,
            discount:discount
        }
        await coupendb.insertMany([data])
        res.redirect('/admin/getcoupen')
          
    }
    catch(error){
        res.render("error");
    }
}

const activate=async(req,res)=>{
    try{
       const id=req.query.id 
       const x=await coupendb.findOne({_id:id})

       if(x.to>=new Date()){
        console.log('not expired');
       await coupendb.updateOne({_id:id},{$set:{active:true}})  
       res.redirect('/admin/getcoupen') 
       }
       else{
        await coupendb.updateOne({_id:id},{$set:{active:false}})  
        res.redirect('/admin/getcoupen')

       }
    }
    catch(error){
        res.render("error");
    }
}

const deactivate=async(req,res)=>{
    try{
       const id=req.query.id 
       await coupendb.updateOne({_id:id},{$set:{active:false}})  
       res.redirect('/admin/getcoupen') 
    }
    catch(error){
        res.render("error");
    }
}

const geteditcoupen=async(req,res)=>{
    try{
       const id=req.query.id 
       const editlist=await coupendb.findOne({_id:id})
       res.render('admin/editcoupen',{adminheadlink:true,adminheader:true,editlist,adminfooter:true})
    }
    catch(error){
        res.render("error");
    }
}
const updatecoupean=async(req,res)=>{
    try{
       const id=req.query.id 
       console.log(id);
       console.log(req.body);
       const{code,min,to,discount}=req.body
      
        if(to.length>0){
           
            const editlist=await coupendb.findOneAndUpdate({_id:id},{$set:{coupencode:code,min:min,to:to,discount:discount}})
            res.redirect('/admin/getcoupen')
        }
        else{
            
            const editlist=await coupendb.findOneAndUpdate({_id:id},{$set:{coupencode:code,min:min,discount:discount}})
            res.redirect('/admin/getcoupen')
        }   
    }
    catch(error){
        res.render("error");
    }
}
const deletecoupen=async(req,res)=>{
    try{
       const id=req.query.id 
      await coupendb.deleteOne({_id:id})
       res.redirect('/admin/getcoupen')
    }
    catch(error){
        res.render("error");
    }
}

module.exports={
    coupenpage,
    getaddpage,
    postcoupen,
    activate,
    deactivate,
    geteditcoupen,
    updatecoupean,
    deletecoupen
}