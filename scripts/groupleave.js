const group=require("../models/group")
const user=require("../models/user")
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
}