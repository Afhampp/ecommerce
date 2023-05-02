var express = require('express');
const nocache = require('nocache');
var userController=require('../controller/userController')
var auth=require('../middleware/auth')
var wishlistcontroller=require('../controller/wishlistcontroller')
var router = express.Router();
var upload=require('../middleware/upload')

/* GET users listing. */
router.get('/',userController.userhome)
router.get('/userlogin',auth.userlogged,userController.getuserlogin )
router.post('/login',userController.postlogin)
router.get('/signup',auth.userlogged,userController.getsignup)
router.post('/signups',userController.postsignup)
router.get('/userlogout',userController.logout)

/* profile */
router.get('/profile',userController.getprofile)
router.get('/edit',userController.editprofile)
router.post('/update',userController.update)
router.post('/profilesubmit',upload.single('file'),userController.updateprofile)

/* mailvarify */
router.post('/verify',userController.otpverify)
router.get('/getotp',auth.userlogged,userController.getotp)
router.get('/resendotp',auth.userlogged,userController.resendotp)


/* Forget Password */
router.get('/getemail',userController.getemail)
router.post('/postemail',userController.postemail)
router.get('/verifypass',userController.getpassword)
router.post('/postpass',userController.postconfirm)
router.get('/forgetgetotp',userController.forgetgetotp)
router.post('/forgetotpverify',userController.postforgetotp)


/* List of product */
router.get('/productlist',userController.productlist)
router.get('/categerywise',userController.categoryview)
router.get('/singleview',userController.singleview)



/* List of Wish list */
router.get('/getwishlist',wishlistcontroller.getwishlist)
router.get('/addwish',wishlistcontroller.addwishlist)
router.get('/pullitem',wishlistcontroller.pullitem)

/* List of CART */
router.get('/getcart',userController.cartview)
router.get('/addtocart',userController.addtocart)

router.get('/deletesingle',userController.deletesingle)
router.put('/cart/update/:id', userController.updatecart)

/* List of CHECKOUT */
router.get('/getcheckout',userController.getcheckout)
router.get('/selectadd',userController.selectadd)
router.post('/postaddress',userController.postaddress)
router.post('/selectone',userController.selectone)
router.post('/postpayment',userController.payment)
router.get('/paymentcomplete',userController.getcomplete)
router.post('/verify-payment',userController.paymentverify)




/* cancelling product */
router.get('/procancel',userController.cancelpage)
router.get('/viewitem',userController.getitem)
router.get('/cancelcomplete',userController.cancelledcomplete)
router.get('/cancelitempro',userController.cancelitem)
router.get('/returnpro',userController.returnpro)


/* coupen */
router.post('/postcoupen',userController.postcoupen)

/* contact */
router.get('/contact',userController.getcontact)


module.exports = router;
