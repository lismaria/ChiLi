const group=require("../models/group")
const user=require("../models/user")
const alert=require("alert");
const mongoose=require("mongoose");


module.exports=function(app,express)
{
    var urlencodedParser=express.urlencoded({extended:false});

    app.post("/leavegroup/:id",urlencodedParser,function(req,res)
    {
        group.findOneAndUpdate({_id:req.params.id},{ $pull: { users: { _id: req.session.user._id} } }).then(function(result){

        var id = mongoose.Types.ObjectId(req.params.id);
            user.findOneAndUpdate({_id:req.session.user._id},{ $pull: { groups: { _id: id}}},{ new: true }).then(function(userr){
                req.session.user = userr;
                alert("Group Left");
                res.redirect("/");
            })
            
        });
    });
}