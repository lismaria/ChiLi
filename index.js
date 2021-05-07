const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const path = require('path');
const authenticate = require("./controllers/authenticate");     //importing the authentication file
const app=express();

const port = process.env.PORT || 3000;
app.listen(port,()=>console.log("Port active :",port));

app.use(express.static(path.resolve(__dirname)));               //to load static files
app.use(express.json());
app.use(express.urlencoded({extended:false}));               //to extract queries from html form 
app.engine('html', require('ejs').renderFile);                  //sets the templating engine to ejs of html files
app.use(session({
    secret:'secret-key',
    resave:false,
    saveUninitialized:true,
}));

mongoose.connect('mongodb+srv://chili:lischirag@chilicluster.kios7.mongodb.net/dummy?retryWrites=true&w=majority&ssl=true',
                    {useNewUrlParser: true, useUnifiedTopology: true});            //connecting to database
mongoose.connection.once("open",function()                                         //once connected
{
    console.log("Database Connection made");
}).on("error",function(err)                                                         //always on, to get errors
{   
    console.log("ERROR :",err);
});


app.get("/",function(req,res)                                   //initially loading index file
{
    app.render("index.html");
});
authenticate(app,express);                                   //passing args to authenticate file
