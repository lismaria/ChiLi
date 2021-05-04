const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const authenticate = require("./controllers/authenticate");     //importing the authentication file


var app=express();
app.listen(5501);

app.use(express.static(path.resolve(__dirname)));               //to load static files
app.use(bodyParser.urlencoded({extended:false}));               //to extract queries from html form 
// var urlencodedParser=bodyParser.urlencoded({extended:false});
// app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);                  //sets the templating engine to ejs of html files


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
authenticate(app,bodyParser);                                   //passing args to authenticate file
