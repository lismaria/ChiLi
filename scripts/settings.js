const group=require("../models/group")            //importing the group model
const user=require("../models/user")

const uniqid=require("uniqid");
const alert=require("alert");

module.exports=function(app,express)
{
    var urlencodedParser=express.urlencoded({extended:false});

    app.get("/settings",urlencodedParser,function(req,res){
        // console.log("in settings")
        res.render("./service/layout/settings.ejs")
    });

}