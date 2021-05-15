const group=require("../models/group")            //importing the group model
const user=require("../models/user")
const mongoose=require("mongoose")

module.exports =function(app,express,io)
{
    var urlencodedParser=express.urlencoded({extended:false});
    app.get("/forums/:id",urlencodedParser,function(req,res)
    {
        var counter=0;
        group.findOne({_id:req.params.id}).then(function(result)            //getting Group ID from url, passed by layout/partials/nav.ejs
        {
            for(i in result.users)
            {
                if(result.users[i].user_name==req.session.user.user_name)       //if the user is found, render the resource page
                {
                    counter=counter+1;
                    res.render("./service/layout/forums.ejs",{group:result})      //sending group object in layout/forums.ejs
                } 
            }
            if(counter==0){                                                     //if user havent joined the group but is trying to access from url
                res.write("<a href='/'>Return to home</a> <br><br>");
                res.write("No group found");
                res.end();
            }
        })
    });

    io.on('connection',function(socket){
    })
}