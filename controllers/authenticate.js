module.exports=function(app,bodyParser)
{
    var urlencodedParser=bodyParser.urlencoded({extended:false});
    const user=require("../models/user")
    const alert=require("alert");
    const bcrypt = require("bcrypt");

    app.post("/signup",urlencodedParser,async function(req,res)
    {
        const hashpswd=await bcrypt.hash(req.body.user_pswd,10);
        var newuser=new user({
            user_name:req.body.user_name,
            full_name:req.body.full_name,
            user_email:req.body.user_email,
            user_pswd:hashpswd
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
                res.redirect("/#!signup");
            }
        })
        
    })
    app.post("/login",urlencodedParser,function(req,res){
        user.findOne({user_name:req.body.user_name})
            .then(async function(result){
                if(result==null){
                    alert("no user found");
                    res.redirect("/#!login")
                }
                else
                {
                    const check=await bcrypt.compare(req.body.user_pswd,result.user_pswd);
                    if(check)
                    {
                        alert("login successful");
                        res.status(200).send("Welcome "+result.user_name);
                    }
                    else
                    {
                        alert("incorrect password");
                        res.redirect("/#!login");
                    }
                }
            })
    })
}