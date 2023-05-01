var express = require('express');
const nocache = require('nocache');
var adcontroller=require('../controller/adminController')
var authadmin=require('../middleware/adminauth')
var adminuploads=require('../middleware/upload')
var categoriescontroller=require('../controller/categeriosController')
var productcontroller=require('../controller/productController')
var bannercontroller=require('../controller/bannerController')
var ordercontroller=require('../controller/ordercontroller')
var coupeanController=require('../controller/coupenController')
var router = express.Router();


/* GET admin page. */
router.get('/',adcontroller.getadminlogin)
router.post('/login',adcontroller.postadmin)
router.get('/home',authadmin.adminlogged,adcontroller.dashboard)
router.get('/logout',adcontroller.getlogout)



/* GET viewuser page. */
router.get('/table',authadmin.adminlogged,adcontroller.tabledata)
router.get('/block',authadmin.adminlogged,adcontroller.blockuser)
router.get('/unblock',authadmin.adminlogged,adcontroller.unblockuser)



/* categerios */
router.get('/categories',authadmin.adminlogged,categoriescontroller.getcategories)
router.get('/addcategories',authadmin.adminlogged,categoriescontroller.showadd)
router.post('/add',categoriescontroller.addcategories)
router.get('/edit',authadmin.adminlogged,categoriescontroller.editcat)
router.post('/updatecat',categoriescontroller.uploadcat)
router.get('/list',authadmin.adminlogged,categoriescontroller.list)
router.get('/unlist',authadmin.adminlogged,categoriescontroller.unlist)





/* products */
router.get('/addproduct',authadmin.adminlogged,productcontroller.addproduct)
router.post('/postproduct',adminuploads.array('file',4),productcontroller.postproduct)
router.get('/showproduct',authadmin.adminlogged,productcontroller.getproduct)
router.get('/editpage',authadmin.adminlogged,productcontroller.editproductpage)
router.post('/editproduct',adminuploads.array('file',4),productcontroller.editproduct)
router.delete('/deletepro',productcontroller.productdelete)
router.get('/listpro',authadmin.adminlogged,productcontroller.list)
router.get('/unlistpro',authadmin.adminlogged,productcontroller.unlist)
router.delete('/deleteimage',productcontroller.imagedelete)
router.post('/addimage',authadmin.adminlogged,productcontroller.addimage)


/* banner */
router.get('/getbannerpage',authadmin.adminlogged,bannercontroller.getbannertable)
router.get('/geteditbanner',authadmin.adminlogged,bannercontroller.geteditbanner)
router.post('/posteditbanner',adminuploads.single('file'),bannercontroller.posteditbanner)
router.get('/viewbanner',authadmin.adminlogged,bannercontroller.viewbanner)
router.get('/cancelviewbanner',authadmin.adminlogged,bannercontroller.cancelviewbanner)



/* order */
router.get('/getorderpage',authadmin.adminlogged,ordercontroller.getorder)
router.get('/view',authadmin.adminlogged,ordercontroller.getorderitem)
router.get('/cancel',authadmin.adminlogged,ordercontroller.cancelled)
router.get('/cancelitem',authadmin.adminlogged,ordercontroller.cancelleditem)
router.get('/complete',authadmin.adminlogged,ordercontroller.complete)
router.get('/shipping',authadmin.adminlogged,ordercontroller.shipping)
router.get('/accept',authadmin.adminlogged,ordercontroller.accpetreturn)
router.get('/decline',authadmin.adminlogged,ordercontroller.decline)




/* coupen */
router.get('/getcoupen',authadmin.adminlogged,coupeanController.coupenpage)
router.get('/addcoupen',authadmin.adminlogged,coupeanController.getaddpage)
router.post('/postcoupen',coupeanController.postcoupen)
router.get('/active',authadmin.adminlogged,coupeanController.activate)
router.get('/deactive',authadmin.adminlogged,coupeanController.deactivate)
router.get('/editcoupen',authadmin.adminlogged,coupeanController.geteditcoupen)
router.post('/updatecoupen',coupeanController.updatecoupean)
router.get('/deletecoupen',authadmin.adminlogged,coupeanController.deletecoupen)




module.exports = router;
