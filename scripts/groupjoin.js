const group=require("../models/group")            //importing the group model
const alert=require("alert");
const bcrypt=require("bcrypt");               //for encryption

module.exports=function(app,express)
{
    var urlencodedParser=express.urlencoded({extended:false});

    app.post("/creategroup",urlencodedParser,function(req,res){
        var newgroup=new group({                                          //storing the details
            group_name:req.body.group_name,
            admin_name:req.session.user.user_name,
            group_descr:req.body.group_descr,
            group_code:"abcd"
        });
        
        newgroup.save((err, doc) => {
            if (!err){
                res.send("group created")
                }
            else {
                res.send(err);
            }})
    })
}