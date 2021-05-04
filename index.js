const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const signup = require("./controllers/signup");


var app=express();
app.listen(5500);

app.use(express.static(path.resolve(__dirname)));
app.use(bodyParser.urlencoded({extended:false}));
// var urlencodedParser=bodyParser.urlencoded({extended:false});
// app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


mongoose.connect('mongodb+srv://chili:lischirag@chilicluster.kios7.mongodb.net/dummy?retryWrites=true&w=majority&ssl=true',
                    {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.once("open",function()
{
    console.log("Database Connection made");
}).on("error",function(err)
{
    console.log("ERROR :",err);
});


app.get("/",function(req,res)
{
    app.render("index.html");
});
signup(app,bodyParser);