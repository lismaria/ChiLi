const user=require("../models/user")            //importing the user model
const alert=require("alert");
const bcrypt=require("bcrypt");               //for encryption

module.exports=function(app,express)
{
    var urlencodedParser=express.urlencoded({extended:false});

    app.post("/signup",urlencodedParser,async function(req,res)            //registering the user
    {
        const hashpswd=await bcrypt.hash(req.body.user_pswd,10);        //encrypting the user password
        var newuser=new user({                                          //storing the details
            user_name:req.body.user_name,
            full_name:req.body.full_name,
            user_email:req.body.user_email,
            user_pswd:hashpswd,
            profile_pic:req.body.user_name
        });
        
        user.findOne({$or:[{user_name:req.body.user_name},{user_email:req.body.user_email}]}).then(function(result)     //finding either username or user_email
        {
            if(result==null)                        //if no record exists then save the new record
            {
                newuser.save((err, doc) => {
                    if (!err)
                        res.redirect("/#!login");
                    else {
                        res.send(err);
                    }})
            }
            else                                    //if a record already exists
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
    
    app.post("/login",urlencodedParser,function(req,res){               //user authentication
        user.findOne({user_name:req.body.user_name})                    //finding record through username
            .then(async function(result){
                if(result==null){                                       //if record not found
                    alert("no user found");
                    res.redirect("/#!login")
                }
                else                                                    //if record found
                {
                    const check=await bcrypt.compare(req.body.user_pswd,result.user_pswd);      //comparing the encrypted password
                    if(check)
                    {
                        req.session.user=result;                        //storing the user in session
                        alert("login successful");
                        res.redirect('/');
                    }
                    else
                    {
                        alert("incorrect password");
                        res.redirect("/#!login");
                    }
                }
            })
    })

    app.get("/logout",function(req,res){
        req.session.destroy();
        res.redirect("/#!login");
    })
}