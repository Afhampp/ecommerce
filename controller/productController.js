const productdb=require('../model/productmodel')
const catogeriesdb=require('../model/categoriesmodel')

const addproduct=async(req,res)=>{
    try{
        const categoryData=await catogeriesdb.find()
    
       
       if(categoryData)
        res.render('admin/adminproducts',{adminheadlink:true,adminheader:true,categoryData,adminfooter:true})
    }
    catch(error){
        res.render("error");
        
    }
}
const postproduct=async(req,res)=>{
    try{
        const imageNames = req.files.map((file) => file.filename);
            const categeriosname=await catogeriesdb.findOne({categories:req.body.categories})
            const objectid=categeriosname._id
            const data={
                name:req.body.name,
                brand:req.body.brand,
                quantity:req.body.quantity,
                description:req.body.description,
                price:req.body.price,
                categories:objectid,
                images:imageNames,
            }
            await productdb.insertMany([data])
          res.redirect('/admin/showproduct')
}
    catch(error){
        res.render("error");
    }
}

const getproduct=async(req,res)=>{
    try{
       const showproduct=await productdb.find()
      
        
       
        res.render('admin/adminshowproduct',{adminheadlink:true,adminheader:true,showproduct,adminfooter:true})
    }
    catch(error){
        res.render("error");
    }
}

const editproductpage=async(req,res)=>{
    try{
       const editproduct=await productdb.findById({_id:req.query.id}).populate("categories")
       
       if(editproduct){
        res.render('admin/producteditpage',{adminheadlink:true,adminheader:true,editproduct,adminfooter:true})
       }
    }
    catch(error){
        res.render("error");
    }
}

const editproduct=async(req,res)=>{
    try{
       
      
       
    
       if(req.files && req.files.length>0){


        if(req.files && req.files.length==1){
            file = req.files.map((file) => file.filename);
            const findimage=await productdb.find({_id:req.query.id})
            const[{images}]=findimage
            for(const x of images){
                file.push(x)
            }
            const categeries= await catogeriesdb.findOne({categories:req.body.categerioes})
            const showproduct=await productdb.findOneAndUpdate({_id:req.query.id},{$set: {name:req.body.name,brand:req.body.brand,price:req.body.price,quantity:req.body.quantity,description:req.body.description,categories:categeries._id}},{$push:{images:[file]}})
            if(showproduct){
             res.redirect('/admin/showproduct')}
        }else if(req.files && req.files.length==2){ file = req.files.map((file) => file.filename);
            const findimage=await productdb.find({_id:req.query.id})
            const[{images}]=findimage
            for(const x of images){
                file.push(x)
            }
            const categeries= await catogeriesdb.findOne({categories:req.body.categerioes})
            const showproduct=await productdb.findOneAndUpdate({_id:req.query.id},{$set: {name:req.body.name,brand:req.body.brand,price:req.body.price,quantity:req.body.quantity,description:req.body.description,categories:categeries._id,images:file}})
            if(showproduct){
             res.redirect('/admin/showproduct')
            }
        }else{file = req.files.map((file) => file.filename);
                const categeries= await catogeriesdb.findOne({categories:req.body.categerioes})
                const showproduct=await productdb.findOneAndUpdate({_id:req.query.id},{$set: {name:req.body.name,brand:req.body.brand,price:req.body.price,quantity:req.body.quantity,description:req.body.description,categories:categeries._id,images:file}})
           
                if(showproduct){
                 res.redirect('/admin/showproduct')
                }}
        
        }else{
            const categeries= await catogeriesdb.findOne({categories:req.body.categerioes}) 
            const showproduct=await productdb.findOneAndUpdate({_id:req.query.id},{$set: {name:req.body.name,brand:req.body.brand,price:req.body.price,quantity:req.body.quantity,description:req.body.description,categories:categeries._id}})
        
            if(showproduct){
             res.redirect('/admin/showproduct')
            }
        }
  
    }
    catch(error){
        res.render("error");
    }
}
const productdelete=async(req,res)=>{
    try{
       const showproduct=await productdb.findByIdAndDelete({_id:req.query.id})
       if(showproduct){
        res.redirect('/admin/showproduct')
       }
    }
    catch(error){
        res.render("error");
    }
}
const list=async (req,res)=>{
    try{
        const userdata=await productdb.findOne({_id:req.query.id})
        if(userdata){
            await productdb.updateOne({_id:userdata},{$set:{is_listed:true}})
            res.redirect('/admin/showproduct')
        }
    }
    catch(error){
        res.render("error");
        
    }
}
const unlist=async (req,res)=>{
    try{
        const userdata=await productdb.findOne({_id:req.query.id})
        if(userdata){
            await productdb.updateOne({_id:userdata},{$set:{is_listed:false}})
            res.redirect('/admin/showproduct')
        }
    }
    catch(error){
        res.render("error");
    }
}
const imagedelete=async (req,res)=>{
    try{
       
        const id=req.body.productId
        const image=req.body.image
        const x=await productdb.findOneAndUpdate({_id:id},{$pull:{images:image}})
     
        res.json({status:true})
       
    }
    catch(error){
   
        res.render("error");
    }
}

const addimage=async (req,res)=>{
    try{
       
        const id=req.body.productId
        const image=req.body.image
        const x=await productdb.findOneAndUpdate({_id:id},{$pull:{images:image}})
     
        res.json({status:true})
       
    }
    catch(error){
        res.render("error");
    }
}

module.exports={
    addproduct,
    postproduct,
    getproduct,
    editproductpage,
    editproduct,
    productdelete,
    list,
    unlist,
    imagedelete,
    addimage
}
