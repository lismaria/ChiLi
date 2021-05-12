const group=require("../models/group")            //importing the group model
const user=require("../models/user")
// const uniqid=require("uniqid");
const alert=require("alert");

module.exports=function(app,express)
{
    var urlencodedParser=express.urlencoded({extended:false});

    app.get("/info/:id",urlencodedParser,function(req,res)
    {
        var counter=0;
        group.findOne({_id:req.params.id}).then(function(result)
        {
            for(i in result.users)
            {
                if(result.users[i].user_name==req.session.user.user_name)
                {
                    counter=counter+1;
                    res.render("./service/layout/info.ejs",{group:result})
                } 
            }
            if(counter==0){
                res.write("<a href='/'>Return to home</a> <br><br>");
                res.write("No group found");
                res.end();
            }
        })
    });
}