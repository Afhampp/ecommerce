
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var nocache=require("nocache")
var logger = require('morgan');
var session=require('express-session')
var hbs=require("express-handlebars")
const mongoose =require('mongoose')
require('dotenv').config()
mongoose.set("strictQuery",false)
var Handlebars = require('handlebars');

Handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});


var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layouts/',partialsDir:__dirname+'/views/partials',runtimeOptions:{allowProtoPropertiesByDefault:true,allowProtoMethodsByDefault:true,},}))
app.use(nocache());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use(session({secret:process.env.SESSION_SECRET_KEY,cookie:{maxAge:30000},resave:false, saveUninitialized:true}))
mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
.then(()=>{
    console.log("connected");
}).catch(()=>{
    console.log("error in connection");
})


app.use('/admin', adminRouter);
app.use('/', usersRouter);


app.listen(3000)

module.exports = app;
