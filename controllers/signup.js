module.exports=function(app,bodyParser)
{
    var urlencodedParser=bodyParser.urlencoded({extended:false});
    const user=require("../models/user")
    const alert=require("alert");

    app.post("/signup",urlencodedParser,function(req,res)
    {
        var newuser=new user({
            user_name:req.body.user_name,
            full_name:req.body.full_name,
            user_email:req.body.user_email,
            user_pswd:req.body.user_pswd
        });
        user.findOne({$or:[{user_name:req.body.user_name},{user_email:req.body.user_email}]}).then(function(result)
        {
            if(result==null)
            {
                newuser.save((err, doc) => {
                    if (!err)
                        res.redirect("/#!login");
                    else {
                        res.send(err);
                    }})
            }
            else
            {
                if(result.user_name==req.body.user_name && result.user_email!=req.body.user_email)
                    alert("username taken");
                else if(result.user_name!=req.body.user_name && result.user_email==req.body.user_email)
                    alert("email id already registered");
                else
                    alert("User exists");
                res.redirect("/#!signup")
            }
        })
        
    })
}