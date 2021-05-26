const group=require("../models/group")            //importing the group model
const user=require("../models/user")

const uniqid=require("uniqid");                    //for creating a unique group code
const alert=require("alert");

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
                profile_pic:req.session.user.profile_pic
            }]
        });
        
        await newgroup.save()                                             //first saving the new group


        group.findOne({_id:newgroup._id}).then(function(result){                        
            user.findOne({_id:req.session.user._id}).then(async function(user){             //saving groups to user object
                user.groups.push({_id:newgroup._id,group_name:newgroup.group_name,group_code:newgroup.group_code});
                var userr=await user.save();                                //saving the new user and then updating it in new session
                req.session.user=userr;
                res.redirect("/info/"+newgroup._id)
            })
        })        
    })


    app.post("/joingroup",urlencodedParser,function(req,res){
        var counter=0;
        group.findOne({group_code:req.body.group_code}).then(function(result){          //if the group code doesnt match
            if(result==null){
                alert("Group Doesnt Exist.");
                res.redirect("/")
            }
            else{
                // group.aggregate([{$unwind:"$users"},{$match:{"users._id":req.session.user._id}}]).then(function(userr){
                //     console.log(userr);
                //     alert("You already exist nig");
                //     return 0;
                // })

                for(i in result.users)                                              //traversing the users array in group object
                {
                    if(result.users[i].user_name==req.session.user.user_name)       //if the user already exists in group
                    {
                        counter=counter+1;
                        alert("You already there");
                        res.redirect("/");
                    } 
                }

                if(counter==0)                                                  //if the user doesnt exist in a certain group then add them
                {
                    result.users.push({_id:req.session.user._id,user_name:req.session.user.user_name,full_name:req.session.user.full_name,profile_pic:req.session.user.profile_pic});
                    result.save();
    
                    user.findOne({_id:req.session.user._id}).then(async function(user){     //updating the user object too
                        user.groups.push({_id:result._id,group_name:result.group_name});
                        var userr=await user.save();
                        req.session.user=userr;
                        res.redirect("/info/"+result._id);
                    })
                    
                }
            }
        })
    })
}