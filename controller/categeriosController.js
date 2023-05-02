const categoriesdb=require('../model/categoriesmodel')



const getcategories=async(req,res)=>{
    try{
       const showtable=await categoriesdb.find()
            res.render('admin/admincategor',{adminheadlink:true,adminheader:true,showtable,adminfooter:true})
        
    }
    catch(error){
        res.render("error");
    }
}
const showadd=(req,res)=>{
    try{
       
            res.render('admin/adminaddcat',{adminheadlink:true,adminheader:true,adminfooter:true})
        
    }
    catch(error){
        res.render("error");
    }
}
const addcategories=async(req,res)=>{
    try{
            
            const addcat= await categoriesdb.findOne({categories:req.body.name})
            if(addcat){
                res.render('admin/adminaddcat',{adminheadlink:true,adminheader:true,message:"already exist",adminfooter:true})            
            }
            else{
                await categoriesdb.insertMany([{categories:req.body.name}])
                const showtable=await categoriesdb.find()
              
                res.redirect('/admin/categories')
            }
            
        
    }
    catch(error){
        res.render("error");
    }
}
const uploadcat=async(req,res)=>{
    try{
            console.log(req.query.id);
            const findcaat= await categoriesdb.findByIdAndUpdate({_id:req.query.id},{$set:{categories:req.body.name}})
            if(findcaat){
                res.redirect("/admin/categories")            
            }
        
        
    }
    catch(error){
        res.render("error");
    }
}
const editcat=async(req,res)=>{
    try{
       
            const editcaat= await categoriesdb.findById({_id:req.query.id})
            if(editcaat){
                res.render('admin/adminupdate',{adminheadlink:true,adminheader:true,editcaat,adminfooter:true})            
            }
        
        
    }
    catch(error){
        res.render("error");
    }
}
const deletecat=async(req,res)=>{
    try{
           
            const delcaat= await categoriesdb.findByIdAndDelete({_id:req.query.id})
            
             res.redirect("/admin/categories")            
        
        
        
    }
    catch(error){
        res.render("error");
    }
}
const list=async (req,res)=>{
    try{
        const userdata=await categoriesdb.findOne({_id:req.query.id})
        if(userdata){
            await categoriesdb.updateOne({_id:userdata},{$set:{is_list:true}})
            res.redirect('/admin/categories')
        }
    }
    catch(error){
        res.render("error");
    }
}
const unlist=async (req,res)=>{
    try{
        const userdata=await categoriesdb.findOne({_id:req.query.id})
        if(userdata){
            await categoriesdb.updateOne({_id:userdata},{$set:{is_list:false}})
            res.redirect('/admin/categories')
        }
    }
    catch(error){
        res.render("error");
    }
}

module.exports={
    getcategories,
    addcategories,
    uploadcat,
    showadd,
    editcat,
    deletecat,
    list,
    unlist
}