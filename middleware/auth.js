const userdb=require('../model/usermodel')

const userlogged = (req, res, next) => {
    try {
      if (req.session.user_id) {
        res.redirect('/')
      } else {
        next();
      }
    } catch (error) {
      console.log(error);
    }
  }
  
const islogout=(req,res,next)=>{
    try{
        if(req.session.user_id){
            
            res.redirect('/')
            
        }else{
        
        next()
    }
}
    catch(error){
        console.log(error);
    }
}

const userblocking=async(req,res,next)=>{
    try{
        const blocked= await userdb.findOne({is_blocked:true})
        if(blocked){
            usersession=req.session.user_id
            res.render("user/userlogin",{userheadlink:true,userheader:true,usersession,userfooter:true,message:"You are bloacked"})
        }
        else{
            next()
        }
    }
    catch(error){
        console.log(error);
    }
}
const userverify=async(req,res,next)=>{
    try{
        const userverify= await userdb.findOne({is_verified:1})
        if(userverify){
            usersession=req.session.user_id
            res.render("user/userlogin",{userheadlink:true,userheader:true,usersession,message:"You are bloacked",userfooter:true})
        }
        else{
            next()
        }
    }
    catch(error){
        console.log(error);
    }
}
module.exports={
    userlogged,
    islogout,
    userblocking,
    userverify
}