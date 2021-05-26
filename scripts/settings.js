const group=require("../models/group")            //importing the group model
const user=require("../models/user")
const chat=require("../models/chatModel")

module.exports=function(app,express)
{
    var urlencodedParser=express.urlencoded({extended:false});

    app.get("/settings",urlencodedParser,function(req,res){
        res.render("./service/layout/settings.ejs")
    });

    app.post("/settings",function(req,res)
    {
        user.findOneAndUpdate({_id:req.session.user._id},{full_name:req.body.full_name,profile_pic:req.body.profile_pic}).then(function()
        {
            user.findOne({_id:req.session.user._id}).then(function(result)
            {
                req.session.user=result;

                group.updateMany({ "users.user_name": req.session.user.user_name},{ $set: { "users.$.full_name" : req.session.user.full_name ,"users.$.profile_pic":req.session.user.profile_pic} }).then(function()
                {
                    res.redirect("/settings");
                })

                // chat.updateMany({ "messages.user_name": req.session.user.user_name},
                // { $set: { "messages.$.profile_pic" : req.session.user.profile_pic } }).then(function()
                // {
                    
                // })
            })
        })
    })
}