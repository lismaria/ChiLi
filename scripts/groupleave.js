const group=require("../models/group")
const user=require("../models/user")
const chat=require("../models/chatModel")
const forum=require("../models/forumModel")
const resource=require("../models/resourceModel")
const news=require("../models/newsModel")
const alert=require("alert");
const mongoose=require("mongoose");


module.exports=function(app,express)
{
    var urlencodedParser=express.urlencoded({extended:false});

    app.post("/leavegroup/:id",urlencodedParser,function(req,res)           //getting group ID from layout/info.ejs
    {
        group.findOneAndUpdate({_id:req.params.id},{ $pull: { users: { _id: req.session.user._id} } }).then(function(result){       //finding the group by ID first,then finding the subdocument,deleting it using $pull and saving it automatically using AndUpdate 

        var id = mongoose.Types.ObjectId(req.params.id);            //converting string ID to MongoDB ObjectID (otherwise==>CastError)
            user.findOneAndUpdate({_id:req.session.user._id},{ $pull: { groups: { _id: id}}},{ new: true }).then(function(userr){
                req.session.user = userr;                           //Storing the new user object in session
                alert("Group Left");
                res.redirect("/");
            })
            
        });
    });

    app.post("/deletegroup/:id",urlencodedParser,function(req,res)           //getting group ID from layout/info.ejs
    {
        group.findOne({_id:req.params.id}).then(function(result)
        {
            if(req.session.user.user_name==result.admin_name)
            {
                chat.findOneAndDelete({_id:result.chat_id}).then(function(){});
                news.findOneAndDelete({_id:result.news_id}).then(function(){});
                resource.findOneAndDelete({_id:result.resource_id}).then(function(){});
                forum.findOneAndDelete({_id:result.forum_id}).then(function(){});


                user.updateMany({"groups._id":result._id},{ $pull: { groups: { _id: result._id}}},{ new: true }).then(function()
                {

                })

                group.deleteOne({_id:req.params.id}).then(function()
                {
                    user.findOne({_id:req.session.user._id}).then(function(userr)
                    {
                        req.session.user = userr;                           //Storing the new user object in session
                        alert("Group Deleted");
                        res.redirect("/");
                    })
                })
            }
        })
    });
}