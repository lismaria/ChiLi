const group=require("../models/group")            //importing the group model
const user=require("../models/user")
const alert=require("alert");

module.exports=function(app,express)
{
    var urlencodedParser=express.urlencoded({extended:false});

    app.get("/info/:id",urlencodedParser,function(req,res)
    {
        var counter=0;
        group.findOne({_id:req.params.id}).then(function(result)            //getting Group ID from url, passed by scripts/groupjoin.js
        {
            for(i in result.users)
            {
                if(result.users[i].user_name==req.session.user.user_name)       //if the user is found, render the info page
                {
                    counter=counter+1;
                    res.render("./service/layout/info.ejs",{group:result})      //sending group object in layout/info.ejs
                } 
            }
            if(counter==0){                                                     //if user havent joined the group but is trying to access from url
                res.write("<a href='/'>Return to home</a> <br><br>");
                res.write("No group found");
                res.end();
            }
        })
    });
}