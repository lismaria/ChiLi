const group=require("../models/group")            //importing the group model
const alert=require("alert");
const bcrypt=require("bcrypt");               //for encryption

module.exports=function(app,express){
    app.post("/creategroup",function(req,res){
        var newgroup=new group({                                          //storing the details
            group_name:req.body.group_name,
            admin_name:req.body.admin_name,
            group_descr:req.body.group_descr,
            group_code:req.body.group_code,
            users:[{
                user_name:'ugdhsu',
                full_name:'fdasa'
            }]
        });
        // console.log("users",users);
        newgroup.save();
    })
}