const group=require("../models/group")            //importing the group model
const user=require("../models/user")

const uniqid=require("uniqid");
const alert=require("alert");
const { find } = require("../models/group");

module.exports=function(app,express)
{
    var urlencodedParser=express.urlencoded({extended:false});

    app.post("/creategroup",urlencodedParser,async function(req,res){
        var groupcode=uniqid();
        var newgroup=new group({                                          //storing the details
            group_name:req.body.group_name,
            admin_name:req.session.user.user_name,
            group_descr:req.body.group_descr,
            group_code:groupcode,
            users:[{
                _id:req.session.user._id,
                user_name:req.session.user.user_name,
                full_name:req.session.user.full_name,
            }]
        });
        
        await newgroup.save((err, doc) => {
            if (!err){
                console.log("saved");
                res.send("group created")
                }
            else {
                res.send(err);
            }})

        group.findOne({_id:newgroup._id}).then(function(result){
            console.log(result);
            user.findOne({_id:req.session.user._id}).then(function(user){
                user.groups.push({_id:newgroup._id,group_name:newgroup.group_name,group_code:newgroup.group_code});
                user.save();
            })
        })        
    })
    app.post("/joingroup",urlencodedParser,function(req,res){
        group.findOne({group_code:req.body.group_code}).then(function(result){
            if(result==null){
                alert("Group Doesnt Exist.");
                res.redirect("/")
            }
            else{
                group.users.id(_id).then(function(use){
                    console.log(use.user_name)
                })
                result.users.push({_id:req.session.user._id,user_name:req.session.user.user_name,full_name:req.session.user.full_name});
                result.save();

                user.findOne({_id:req.session.user._id}).then(function(user){
                    user.groups.push({_id:result._id,group_name:result.group_name});
                    user.save();
                })
                res.send("Group Joined")
            }
        })
    })
}