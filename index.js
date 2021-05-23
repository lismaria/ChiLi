const mongoose = require('mongoose');
const express = require('express');
const app=express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const session = require('express-session');
const path = require('path');
const authenticate = require("./scripts/authenticate");     //importing the authentication file
const groupjoin = require('./scripts/groupjoin');
const groupinfo = require('./scripts/groupinfo');
const settings = require('./scripts/settings');
const groupleave = require('./scripts/groupleave');
const chats = require('./scripts/chats');
const resources=require('./scripts/resources');
const news=require('./scripts/news');
const forums = require('./scripts/forums');
const upload=require("express-fileupload");

const port = process.env.PORT || 3000;


app.use(express.static(path.resolve(__dirname+'/views')));               //to load static files
app.use(express.json());
app.use(express.urlencoded({extended:false}));               //to extract queries from html form 
app.use(session({
    secret:'secret-key',
    resave:false,
    saveUninitialized:true,
}));
app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    next();
});
app.use(upload());

app.engine('html', require('ejs').renderFile);                  //sets the templating engine to ejs of html files
app.set('view engine', 'html');


mongoose.connect('mongodb+srv://chili:lischirag@chilicluster.kios7.mongodb.net/dummy?retryWrites=true&w=majority&ssl=true',
                    {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});            //connecting to database
mongoose.connection.once("open",function()                                         //once connected
{
    console.log("Database Connection made");
    http.listen(port,()=>console.log("Port active :",port));
}).on("error",function(err)                                                         //always on, to get errors
{   
    console.log("Failed to connect to db, Please check your network connection.");
});



app.get("/",function(req,res)                                   //initially loading index file
{  
    if(!res.locals.user)                                       //if the user is not logged in
    {
        app.use(express.static(path.resolve(__dirname+'/views/landing')));
        res.render("./landing/index.html");
    }
    else{   
    app.use(express.static(path.resolve(__dirname+'/views/service')));
        res.render("./service/layout/welcome.ejs");
}
});
authenticate(app,express);                                   //passing args to authenticate file
groupjoin(app,express);
groupinfo(app,express);
groupleave(app,express);
settings(app,express);
chats(app,express,io);
forums(app,express,io);
resources(app,express,io);
news(app,express,io);