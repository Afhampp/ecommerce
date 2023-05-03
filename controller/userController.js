const userdb = require("../model/usermodel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const categoriesdb = require("../model/categoriesmodel");
const productdb = require("../model/productmodel");
const cartdb = require("../model/cartmodel");
const otp = require("../middleware/otp");
const orderdb = require("../model/ordermodel");
const coupendb = require("../model/coupenmodel");
const admindb = require("../model/adminmodel");
const bannerdb = require("../model/bannermodel");
const Razorpay = require("razorpay");

const { response } = require("express");

var instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret:process.env.KEY_SECRET,
});

//----------------------------bbcrypt----------------------------

const securedPassword = async (password) => {
  try {
    const hashpassword = await bcrypt.hash(password, 10);
    return hashpassword;
  } catch (error) {
    res.render("error");
  }
};
//----------------------------bbcrypt----------------------------

//----------------------------to send email for OTP----------------------------
const sendVerification = (name, email, otpa) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "rahulpp12354@gmail.com",
        pass: "vruwimqmfjwbihuo",
      },
    });
    const mailOption = {
      from: "rahulpp12354@gmail.com",
      to: email,
      subject: "for verification mail",
      html: "<p>Hii," + name + ",here is your otp " + otpa + "</p>",
    };
    transporter.sendMail(mailOption, function (error, info) {
      if (error) {
  console.log(error)
      } else {
        console.log("email send", info.response);
      }
    });
  } catch (error) {
    res.render("error");
  }
};
//----------------------------to send email OTP end----------------------------

//----------------------------to send email for forgetpassword----------------------------
const sendpasswordverification = (email,otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "rahulpp12354@gmail.com",
        pass: "vruwimqmfjwbihuo",
      },
    });
    const mailOption = {
      from: "rahulpp12354@gmail.com",
      to: email,
      subject: "for verification mail",
      html:
        '<p>here is the otp for email change' +
        otp +
        '"</p>',
    };
    transporter.sendMail(mailOption, function (error, info) {
      if (error) {
  console.log(error)
      } else {
        console.log("email send", info.response);
      }
    });
  } catch (error) {
    res.render("error");
  }
};

//----------------------------to send email for forgetpassword end----------------------------

//-----------------------to get login page---------------------------
const getuserlogin = (req, res) => {
  try {
    req.session.otp=false
    res.render("user/userlogin", { userheadlink: true });
  } catch (error) {
    res.render("error");
  }
};
const postlogin = async (req, res) => {
  try {
    
    const logindata = await userdb.findOne({ email: req.body.email });
    if (logindata) {
      const passlogin = await bcrypt.compare(
        req.body.password,
        logindata.password
      );
      if (passlogin) {
        const blockeded = await userdb.findOne({
          _id: logindata._id,
          is_blocked: false,
        });
        if (blockeded) {
          req.session.user_id = logindata._id;
          req.session.name = logindata.name;
          res.redirect("/");
        } else {
          res.render("user/userlogin", {
            userheadlink: true,
            userheader: true,
            blockmessage: "You are bloacked",
            userfooter: true,
          });
        }
      } else {
        res.render("user/userlogin", {
          userheadlink: true,
          userheader: true,
          passmessage: "Invalid Password",
          userfooter: true,
        });
      }
    } else {
      res.render("user/userlogin", {
        userheadlink: true,
        userheader: true,
        emailmeassage: "Invalid Email",
        userfooter: true,
      });
    }
  } catch (error) {
    res.render("error");
  }
};
//-----------------------get login page end  ---------------------------

//-----------------------get forgetpassword  ---------------------------
const getemail = (req, res) => {
  try {
    res.render("user/emailverify", { userheadlink: true });
  } catch (error) {
    res.render("error");
  }
};
const postemail = async (req, res) => {
  try {
    const email = req.body.email;
    req.session.email=email
    const userdetails = await userdb.findOne({ email: email });

    if (userdetails) {
      const otpa = otp.otpgen();
      req.session.otp = otpa;
      sendpasswordverification(email,otpa);
      res.redirect("/forgetgetotp");
    } else {
      res.render("user/emailverify", {
        userheadlink: true,
        message: "There is no account for this email ",
      });
    }
  } catch (error) {
    res.render("error");
  }
};
const forgetgetotp = async (req, res) => {
  try {
    res.render("user/forgetotp", { userheadlink: true});
  } catch (error) {
    res.render("error");
  }
};
const postforgetotp=async (req, res) => {
  try {
      const x = req.body.otp;
    const y = req.session.otp;
    if (x == y) {

      res.redirect("/verifypass");
    } else {
      res.render("user/forgetotp", { userheadlink: true, message: "Wrong OTP" });
    }

  
    
  } catch (error) {
    res.render("error");
  }
};
const getpassword = async(req, res) => {
  try {
    const email=req.session.email
    const findid=await userdb.findOne({email:email})
    const id =findid._id ;
    res.render("user/confirmpass", { userheadlink: true, id });
  } catch (error) {
    res.render("error");
  }
};
const postconfirm = async (req, res) => {
  try {
    const pass = req.body.pass;
    const copass = req.body.copass;
    if (pass == copass) {
      const id = req.query.id;
      const hashpassword = await securedPassword(pass);
      await userdb.findByIdAndUpdate(
        { _id: id },
        { $set: { password: hashpassword } }
      );
      req.session.email=false
      res.redirect('/userlogin')
    } else {
      res.render("user/confirmpass", {
        userheadlink: true,
        message: "Confirm passwordis not right",
      });
    }
  } catch (error) {
    res.render("error");
  }
};

//------------------------------to get signup page-------------------------------
const getsignup = (req, res) => {
  try {
    res.render("user/usersignup", { userheadlink: true });
  } catch (error) {
    res.render("error");
  }
};

const postsignup = async (req, res) => {
  try {
    email = req.body.email;
    const checkeremail = await userdb.findOne({ email: email });
    if (checkeremail) {
      res.render("user/usersignup", {
        userheadlink: true,
        userheader: true,
        message: "email already exist",
        userfooter: true,
      });
    } else {
      req.session.user = req.body;
      const otpa = otp.otpgen();
      req.session.otp = otpa;
      sendVerification(req.body.name, req.body.email, otpa);
      res.redirect("/forgetgetotp");
    }
  } catch (error) {
    res.render("error");
  }
};
//------------------------------ signup page END-------------------------------

//------------------------------ to get otp page-------------------------------
const getotp = async (req, res) => {
  try {
    res.render("user/otp", { userheadlink: true });
  } catch (error) {
    res.render("error");
  }
};

const resendotp = (req, res) => {
  try {
    const data = req.session.user;
    const email = data.email;
    const name = data.name;
    const otpa = otp.otpgen();
    req.session.otp = otpa;
    sendVerification(name, email, otpa);
    res.json({ status: true });
  } catch (error) {
    res.render("error");
  }
};
//------------------------------ otp page end-------------------------------

//----------------------------to verify OTP--------------------------------

const otpverify = async (req, res) => {
  try {
      const x = req.body.otp;
    const y = req.session.otp;
    const z = req.session.user;
    if (x == y) {
      await userdb.insertMany([z]);
      res.redirect("/userlogin");
    } else {
      res.render("user/otp", { userheadlink: true, message: "Wrong OTP" });
    }

  
    
  } catch (error) {
    res.render("error");
  }
};
//----------------------------to verify OTP--------------------------------

//------------------to get home----------------------------

const userhome = async (req, res) => {
  try {
    const usersession = req.session.user_id;
    const username = req.session.name;
    const banner1 = await bannerdb.findOne().limit(1);
    const banner2 = await bannerdb.findOne().skip(1).limit(1);
    const banner3 = await bannerdb.findOne().skip(2).limit(1);
    const findproduct= await productdb.find().limit(6)

   
    res.render("user/userhome", {
      userheadlink: true,
      userheader: true,
      usersession,
      username,
      banner1,
      banner2,
      banner3,
      findproduct,
      userfooter: true,
    });
  } catch (error) {
    res.render("error");
  }
};
//------------------to get home----------------------------

//---------------------------FOR PROFILE-------------------

const getprofile = async (req, res) => {
  try {
    usersession = req.session.user_id;
    const username = req.session.name;
    const details = await userdb.findById({ _id: req.session.user_id });
    if (details) {
      res.render("user/userprofile", {
        userheadlink: true,
        userheader: true,
        usersession,
        username,
        details,
        userfooter: true,
      });
    }
  } catch (error) {
    res.render("error");
  }
};

const editprofile = async (req, res) => {
  try {
    const id = req.query.id;
    const editprofile = await userdb.findById({ _id: id });
    if (editprofile) {
      res.render("user/editprofile", { userheadlink: true, editprofile });
    }
  } catch (error) {
    res.render("error");
  }
};
const update = async (req, res) => {
  try {
    const id = req.session.user_id;
    const updateprofile = await userdb.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
        },
      }
    );
    if (updateprofile) {
      res.redirect("/profile");
    }
  } catch (error) {
    res.render("error");
  }
};

const updateprofile = async (req, res) => {
  try {
    const id = req.query.id;
    const updateprofile = await userdb.findByIdAndUpdate(
      { _id: id },
      { $set: { images: req.file.filename } }
    );
    if (updateprofile) {
      res.redirect("/profile");
    }
  } catch (error) {
    res.render("error");
  }
};
// -----------------------PROFILEEND--------------------------------------

// TO SHOW EACH PRODUCTlist--------------------------------------
const productlist = async (req, res) => {
  try {
    var search = "";
    if (req.query.search) {
      search = req.query.search;
    }
    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    const limit = 6;
    const categerioslist = await categoriesdb.find();
    const catogeriesview = await productdb
      .find({
        $or: [
          { name: { $regex: ".*" + search + ".*", $options: "i" } },
          { brand: { $regex: ".*" + search + ".*", $options: "i" } },
        ],
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("categories");
    const count = await productdb
      .find({
        $or: [
          { name: { $regex: ".*" + search + ".*", $options: "i" } },
          { brand: { $regex: ".*" + search + ".*", $options: "i" } },
        ],
      })
      .countDocuments();
    const totalpage = Math.ceil(count / limit);
    let a = [];
    let i = 0;
    for (var j = 1; j <= totalpage; j++) {
      a[i] = j;
      i++;
    }
    if (categoryview) {
      usersession = req.session.user_id;
      const username = req.session.name;

      res.render("user/userproductlist", {
        userheadlink: true,
        userheader: true,
        categerioslist,
        catogeriesview,
        a,
        usersession,
        username,
        userfooter: true,
      });
    }
  } catch (error) {
    res.render("error");
  }
};
// TO SHOW EACH PRODUCTlist--------------------------------------

//--------------singleview-----------------------------
const singleview = async (req, res) => {
  try {
    const catogeriesview = await productdb.findById({ _id: req.query.id });
    const usersession = req.session.user_id;
    const username = req.session.name;
    res.render("user/usersingleview", {
      userheadlink: true,
      userheader: true,
      usersession,
      username,
      catogeriesview,
      userfooter: true,
    });
  } catch (error) {
    res.render("error");
  }
};
//--------------singleview-----------------------------

//--------------categerios-----------------------------

const categoryview = async (req, res) => {
  try {
    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    const limit = 2;
    const usersession = req.session.user_id;
    const username = req.session.name;
    const categerioslist = await categoriesdb.find();
    const cat = await productdb.find({ categories: req.query.id}).limit(limit * 1)
    .skip((page - 1) * limit);
    const count = await productdb.find({ categories: req.query.id}).countDocuments()
    const totalpage = Math.ceil(count / limit);
    let a = [];
    let i = 0;
    for (var j = 1; j <= totalpage; j++) {
      a[i] = j;
      i++;
    }
    res.render("user/categeroyview", {
      userheadlink: true,
      userheader: true,
      categerioslist,
      cat,
      a,
      usersession,
      username,
      userfooter: true,
    });
  } catch (error) {
    res.render("error");
  }
};
//--------------categerios-----------------------------

//--------------Cart-----------------------------

const cartview = async (req, res) => {
  try {
   
    const usersession = req.session.user_id;
    const username = req.session.name;
    const checker = await cartdb.findOne({ 
      user_id: usersession, 
      'products.productid': { $exists: true } 
  }).populate("products.productid");
 
    if (checker) {
      const block=false
      const getproduct = await cartdb
        .find({ user_id: usersession })
        .populate("products.productid");

      var [{ products }] = getproduct;

      const cartlist = products.map(({ productid, quantitypro, tprice }) => ({
        _id: productid._id,
        price: productid.price,
        stock: productid.quantity,
        quantitypro,
        images: productid.images,
        tprice,
      }));

      const totalPrice = cartlist.reduce(
        (total, value) => total + value.tprice,
        0
      );
      await cartdb.findOneAndUpdate(
        { user_id: usersession },
        { $set: { totalprice: totalPrice } }
      );
      res.render("user/cart", {
        userheadlink: true,
        userheader: true,
        usersession,
        username,
        cartlist,
        totalPrice,
        block,
        userfooter: true,
      });
    } else {
      const block =true

      res.render("user/cart", {
        userheadlink: true,
        userheader: true,
        usersession,
        username,
        block,
        userfooter: true,
      });
    }
  } catch (error) {
    res.render("error");
  }
};
const addtocart = async (req, res) => {
  try {
    const usersession = req.session.user_id;
    if (usersession) {
      const finddoc = await cartdb.findOne({ user_id: usersession });
      const productprice = await productdb.findOne({ _id: req.query.id });

      const kprice = productprice.price;

      if (finddoc) {
        const productfinder = await cartdb.findOne({
          user_id: usersession,
          "products.productid": req.query.id,
        });
        if (productfinder) {
          if (productprice.quantity <= 0) {
            res.json({ status: "out" });
          } else {
            await cartdb.updateOne(
              { user_id: usersession, "products.productid": req.query.id },
              {
                $inc: {
                  "products.$.quantitypro": 1,
                  "products.$.tprice": kprice,
                },
              }
            );
            res.json({ status: true });
          }
        } else {
          if (productprice.quantity <= 0) {
            res.json({ status: "out" });
          } else {
            await cartdb.findOneAndUpdate(
              { user_id: usersession },
              {
                $addToSet: {
                  products: {
                    productid: req.query.id,
                    quantitypro: 1,
                    tprice: kprice,
                  },
                },
              }
            );
            res.json({ status: true });
          }
        }
      } else {
        if (productprice.quantity <= 0) {
          res.json({ status: "out" });
        } else {
          await cartdb.create([
            {
              user_id: usersession,
              products: {
                productid: req.query.id,
                quantitypro: 1,
                tprice: kprice,
              },
            },
          ]);
          res.json({ status: true });
        }
      }
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    res.render("error");
  }
};
const updatecart = async (req, res) => {
  try {
    const id = req.params.id;
    const quantity = parseInt(req.body.count);

    usersession = req.session.user_id;

    if (quantity <= req.body.stock) {
      const productprice = await productdb.findOne({ _id: id });
      const kprice = productprice.price * quantity;
      await cartdb.updateOne(
        { user_id: usersession, "products.productid": id },
        {
          $set: {
            "products.$.quantitypro": quantity,
            "products.$.tprice": kprice,
          },
        }
      );
      await cartdb.updateOne(
        { user_id: usersession },
        { $set: { outstock: false } }
      );
      const list = await cartdb
        .find({ user_id: usersession })
        .populate("products.productid");
      var [{ products }] = list;
      const cartlist = products.map(({ productid, quantitypro, tprice }) => ({
        _id: productid._id,
        price: productid.price,
        quantitypro,
        images: productid.images,
        tprice,
      }));
      const totalPrice = cartlist.reduce(
        (total, value) => total + value.tprice,
        0
      );
      const x = await cartdb.findOneAndUpdate(
        { user_id: usersession },
        { $set: { totalprice: totalPrice } }
      );
      res.json({
        status: true,
        data: {
          price: kprice,
          total: totalPrice,
          nodata: "",
        },
      });
    } else {
      res.json({ status: false, data: "Out of stock" });
      await cartdb.updateOne(
        { user_id: usersession },
        { $set: { outstock: true } }
      );
    }
  } catch (error) {
    res.render("error");
  }
};
const deletesingle = async (req, res) => {
  try {
    const usersession = req.session.user_id;

    const findingproduct = await cartdb.findOne({
      user_id: usersession,
      "products.productid": req.query.id,
    });
    if (findingproduct) {
      await cartdb.updateOne(
        { user_id: usersession },
        { $pull: { products: { productid: req.query.id } } }
      );

      res.json({ status: true });
    }
  } catch (error) {
    res.render("error");
  }
};
//--------------CartEND-----------------------------

// -------------------checkout-----------------------------------------------
const getcheckout = async (req, res) => {
  try {
    usersession = req.session.user_id;
    const username = req.session.name;
    const cartchecker = await cartdb.findOne({ user_id: usersession });

    if (cartchecker.outstock) {
      res.redirect("/getcart");
    } else {
      const addressvalue = req.session.selectaddress;
      const coupen = req.session.coupen;


      const cardlistvalue = await cartdb
        .find({ user_id: usersession })
        .populate("products.productid");

      const cartvtotal = await cartdb.findOne({ user_id: usersession });
      req.session.cartid = cartvtotal._id;
      const userinfo = await userdb.findOne({ _id: usersession });
      const wallet = userinfo.wallet;
      let Total = parseInt(cartvtotal.totalprice + 50);
      if (coupen) {
        const listcoupen = await coupendb.findOne({ coupencode: coupen });

        Total = Total - listcoupen.discount;
        if (wallet >= Total) {
          const newwallet = wallet - Total;
          req.session.wallet = newwallet;
          Total = 0;
          req.session.totalpayment = Total;
          const [{ products }] = cardlistvalue;

          const list = products.map(
            ({ productid, quantitypro, tprice, cancelitem }) => ({
              id: productid._id,
              name: productid.name,
              stock: productid.quantity,
              quantitypro,
              tprice,
              cancelitem,
            })
          );
          req.session.productlist = list;
          res.render("user/checkpoy", {
            userheadlink: true,
            userheader: true,
            usersession,
            username,
            addressvalue,
            list,
            cartvtotal,
            Total,
            listcoupen,
            newwallet,
            wallet,
            userfooter: true,
          });
        } else {
          Total = Total - wallet;
          const newwallet = 0;
          req.session.wallet = newwallet;
          req.session.totalpayment = Total;
          const [{ products }] = cardlistvalue;

          const list = products.map(
            ({ productid, quantitypro, tprice, cancelitem }) => ({
              id: productid._id,
              name: productid.name,
              stock: productid.quantity,
              quantitypro,
              tprice,
              cancelitem,
            })
          );
          req.session.productlist = list;
          res.render("user/checkpoy", {
            userheadlink: true,
            userheader: true,
            usersession,
            username,
            addressvalue,
            list,
            cartvtotal,
            Total,
            listcoupen,
            newwallet,
            wallet,
            userfooter: true,
          });
        }
      } else {
        if (wallet >= Total) {
          const newwallet = wallet - Total;
          Total = 0;
          req.session.totalpayment = Total;
          req.session.wallet = newwallet;
          const [{ products }] = cardlistvalue;

          const list = products.map(
            ({ productid, quantitypro, tprice, cancelitem }) => ({
              id: productid._id,
              name: productid.name,
              stock: productid.quantity,
              quantitypro,
              tprice,
              cancelitem,
            })
          );
          req.session.productlist = list;
          res.render("user/checkpoy", {
            userheadlink: true,
            userheader: true,
            usersession,
            username,
            addressvalue,
            list,
            cartvtotal,
            Total,
            wallet,
            newwallet,
            userfooter: true,
          });
        } else {
          Total = Total - wallet;
          req.session.totalpayment = Total;
          const newwallet = 0;
          req.session.wallet = newwallet;
          const [{ products }] = cardlistvalue;

          const list = products.map(
            ({ productid, quantitypro, tprice, cancelitem }) => ({
              id: productid._id,
              name: productid.name,
              stock: productid.quantity,
              quantitypro,
              tprice,
              cancelitem,
            })
          );
          req.session.productlist = list;
          res.render("user/checkpoy", {
            userheadlink: true,
            userheader: true,
            usersession,
            username,
            addressvalue,
            list,
            cartvtotal,
            Total,
            newwallet,
            wallet,
            userfooter: true,
          });
        }
      }
    }
  } catch (error) {
    res.render("error");
  }
};
const selectadd = async (req, res) => {
  try {
    usersession = req.session.user_id;
    const username = req.session.name;
    const y = await userdb.findOne({ _id: usersession });
    const address = y.address;

    res.render("user/choiceaddress", {
      userheadlink: true,
      userheader: true,
      usersession,
      username,
      address,
      userfooter: true,
    });
  } catch (error) {
    res.render("error");
  }
};
const postaddress = async (req, res) => {
  try {
    usersession = req.session.user_id;
    const x = await userdb.find({ _id: usersession });
    req.session.selectaddress = req.body;
    const {
      firstname,
      Lastname,
      phone,
      email,
      country,
      address,
      town,
      district,
      pin,
    } = req.body;
    await userdb.updateOne(
      { _id: usersession },
      {
        $push: {
          address: {
            firstName: firstname,
            LastName: Lastname,
            emailaddress: email,
            phonenumber: phone,
            country: country,
            addressn: address,
            district: district,
            town: town,
            pincode: pin,
          },
        },
      }
    );

    res.redirect("/selectadd");
  } catch (error) {
    res.render("error");
  }
};
const selectone = async (req, res) => {
  try {
    usersession = req.session.user_id;
    req.session.selectaddress = req.body;
    res.redirect("/getcheckout");
  } catch (error) {
    res.render("error");
  }
};

const payment = async (req, res) => {
  try {
    const info = req.session.selectaddress;
    if (info) {
      const paymentmethod = req.body.radio;
      if (paymentmethod == "paypal") {

        const totalPrice = req.session.totalpayment;

        if(totalPrice==0){
          res.json({ status: "zero", data: { msg: "Please click on cod as it is zero amount" } });
        }else{
          var options = {
            amount: totalPrice * 100,
            currency: "INR",
            receipt: "asa",
          };
          instance.orders.create(options, function (err, order) {
           
            res.json({ status: "paypal", data: { order: order } });
          });
        }
       
      } else if (paymentmethod == "COD") {
        const usersession = req.session.user_id;
        const wallet = req.session.wallet;
        const totalPrice = req.session.totalpayment;
        const productlists = req.session.productlist;
        const cartid = req.session.cartid;
        const now = new Date();

        const order = {
          user_id: usersession,
          productinfo: productlists,
          address: info,
          totalprice: totalPrice,
          date: now,
          paymentmethod: "Cash On Delivery",
        };

        for (const x of productlists) {
          await productdb.findByIdAndUpdate(
            { _id: x.id },
            { $inc: { quantity: -x.quantitypro } }
          );
        }

        await orderdb.insertMany([order]);
        await userdb.updateOne(
          { _id: usersession },
          { $set: { wallet: wallet } }
        );
        await cartdb.deleteOne({ user_id: usersession });

        res.json({ status: "COD" });
      } else {
        res.json({
          status: "non",
          data: { msg: "Please click One of the button" },
        });
      }
    } else {
      res.json({
        status: "noadd",
        data: {
          msg: "Please select any address from select button or Fill the checkout page and click save button ",
        },
      });
    }
  } catch (error) {
    res.render("error");
  }
};

const paymentverify = async (req, res) => {
  try {
    const crypto = require("crypto");
    const hmac = crypto.createHmac("sha256", "hc08TSyPLK4h18Go4CDENqfY");
    hmac.update(
      req.body["response[razorpay_order_id]"] +
        "|" +
        req.body["response[razorpay_payment_id]"]
    );
    const hmacs = hmac.digest("hex");

    if (hmacs == req.body["response[razorpay_signature]"]) {
      const usersession = req.session.user_id;
      const info = req.session.selectaddress;
      const totalPrice = req.session.totalpayment;
      const productlists = req.session.productlist;
      const wallet = req.session.wallet;
      const now = new Date()

      const insertorder = {
        user_id: usersession,
        productinfo: productlists,
        address: info,
        totalprice: totalPrice,
        date: now,
        paymentmethod: "online payment",
      };
      for (const x of productlists) {
        await productdb.findByIdAndUpdate(
          { _id: x.id },
          { $inc: { quantity: -x.quantitypro } }
        );
      }
      await orderdb.insertMany([insertorder]);
      await userdb.updateOne(
        { _id: usersession },
        { $set: { wallet: wallet } }
      );
      await cartdb.deleteOne({ user_id: usersession });
      res.json({ status: true });
    } else {
      res.json({ staus: false });
    }
  } catch (error) {
    res.render("error");
  }
};

const getcomplete = async (req, res) => {
  try {
    const usersession = req.session.user_id;
    const username = req.session.name;
    const x = await orderdb.findOne().sort({ date: -1 }).limit(1);
    
    res.render("user/confirmation", {
      userheadlink: true,
      userheader: true,
      usersession,
      username,
      x,
      userfooter: true,
    });
  } catch (error) {
    res.render("error");
  }
};

//--------------checkoutend----------------------------

//--------------payedproducts----------------------------

const cancelpage = async (req, res) => {
  try {
    const usersession = req.session.user_id;
    const username = req.session.name;
    const orderli = await orderdb
      .find({ user_id: usersession })
      .sort({ date: -1 });
      const orderlist = orderli.map(order => {
        const date = new Date(order.date);
        const dateString = date.toLocaleString();
        const id=order.id
        const address = order.address; // update address property
const productinfo = order.productinfo; // update productinfo property
return { ...order._doc, date: dateString, address, productinfo,id };
      })

    res.render("user/cancelpro", {
      userheadlink: true,
      userheader: true,
      usersession,
      username,
      orderlist,
      userfooter: true,
    });
  } catch (error) {
    res.render("error");
  }
};
const getitem = async (req, res) => {
  try {
    const orderid = req.query.id;

    const usersession = req.session.user_id;
    const username = req.session.name;

    if (orderid) {
      req.session.orderid = orderid;
      const orderlist = await orderdb.findOne({ _id: orderid });
      const x = await orderdb.aggregate([
        { $match: { _id: orderlist._id } },
        { $unwind: "$productinfo" },
      ]);

      res.render("user/itemcancel", {
        userheadlink: true,
        userheader: true,
        usersession,
        username,
        x,
        userfooter: true,
      });
    } else {
      const orderlist = await orderdb.findOne({ _id: req.session.orderid });
      const x = await orderdb.aggregate([
        { $match: { _id: orderlist._id } },
        { $unwind: "$productinfo" },
      ]);

      res.render("user/itemcancel", {
        userheadlink: true,
        userheader: true,
        usersession,
        username,
        x,
        userfooter: true,
      });
    }
  } catch (error) {
    res.render("error");
  }
};
const cancelledcomplete = async (req, res) => {
  try {
    const id = req.query.id;
    await orderdb.findByIdAndUpdate(
      { _id: id },
      { $set: { is_cancelled: true } }
    );
    const x = await orderdb.find({ _id: id });
    const [{ productinfo }] = x;
    const productupdate = productinfo.map(({ id, quantitypro }) => ({
      id,
      quantitypro,
    }));
    for (const y of productupdate) {
      const products = await productdb.findByIdAndUpdate(
        { _id: y.id },
        { $inc: { quantity: y.quantitypro } }
      );
    }
    const orderlist = await orderdb.findOne({ _id: id });
    if(orderlist.paymentmethod=="online payment"){
      const finduser = orderlist.user_id;
      const total = orderlist.totalprice;
  
      await userdb.findOneAndUpdate(
        { _id: finduser },
        { $inc: { wallet: total } }
      );
    }
  

    res.redirect("/procancel");
  } catch (error) {
    res.render("error");
  }
};
const cancelitem = async (req, res) => {
  try {
    const productid = req.query.id;
    const userid = req.session.user_id;
    const orders = await orderdb.findOne({ _id: req.session.orderid });
    const order = await orderdb.findOneAndUpdate(
      { _id: orders._id, "productinfo.id": productid },
      { $set: { "productinfo.$.cancelitem": true } }
    );

    const y = await orderdb.aggregate([
      { $match: { _id: orders._id } },
      { $unwind: "$productinfo" },
      { $match: { "productinfo.id": productid } },
    ]);
    const [{ productinfo }] = y;

    const x = await productdb.findOneAndUpdate(
      { _id: productid },
      { $inc: { quantity: productinfo.quantitypro } }
    );
    res.redirect("/viewitem");
  } catch (error) {
    res.render("error");
  }
};

const returnpro = async (req, res) => {
  try {
    const id = req.query.id;
    await orderdb.findByIdAndUpdate(
      { _id: id },
      { $set: { can_return: true } }
    );
    res.redirect("/procancel");
  } catch (error) {
    res.render("error");
  }
};
//.......................................................................................

const postcoupen = async (req, res) => {
  try {
    const usersession = req.session.user_id;
    const tofindtotal = await cartdb.findOne({ user_id: usersession });
    const total = tofindtotal.totalprice;
    const code = req.body.code;
    const x = await coupendb.findOne({ coupencode: code });

    if (x.active == true) {
      if (x.to >= new Date()) {
        if (x.min <= total) {
            const y = await coupendb.aggregate([
              { $unwind: "$user" },
              { $match: { coupencode: code } },
              { $project: { user: 1, _id: 0 } },
            ]);
            let found = null;
            for (const z of y) {
              if (usersession == z.user) {
                found = true;
                break;
              }
            }
 
            if (found === null) {
              req.session.coupen = code;
              await coupendb.updateOne(
                { coupencode: code },
                { $push: { user: usersession } }
              );

              res.json({ status: "found", data: "coupen is activated" });
              
            } else {
           
              res.json({ status: "already", data: "already used" });
            }
          
        } else {
     
          res.json({ status: "min", data: "minnium is required" });
        }
      } else {
     
        res.json({ status: "notfound", data: "coupen expired" });
      }
    } else {

      res.json({ status: "notfound", data: "coupen expired" });
    }
  } catch (error) {
    res.render("error");
  }
};


const getcontact =(req, res) => {
  try {
    const usersession=req.session.user_id
    const username = req.session.name;

    res.render('user/contact', {
      userheadlink: true,
      userheader: true,
      usersession,
      username,
      userfooter: true,
    })
  } catch (error) {
    res.render("error");
  }
};

//--------------LOGOUT-----------------------------

const logout = (req, res) => {
  try {
    req.session.user_id = false;
    req.session.name = false;

    res.redirect("/");
  } catch (error) {
    res.render("error");
  }
};

module.exports = {
  getuserlogin,
  getsignup,
  postsignup,
  otpverify,
  postlogin,
  userhome,
  getprofile,
  logout,
  editprofile,
  update,
  updateprofile,
  productlist,
  singleview,
  categoryview,
  cartview,
  addtocart,
  updatecart,
  deletesingle,
  getcheckout,
  getotp,
  selectadd,
  postaddress,
  selectone,
  payment,
  getcomplete,
  getemail,
  postemail,
  getpassword,
  postconfirm,
  cancelpage,
  getitem,
  cancelledcomplete,
  cancelitem,
  paymentverify,
  postcoupen,
  returnpro,
  resendotp,
  getcontact,
  forgetgetotp,
  postforgetotp
};
