const group=require("../models/group")            //importing the group model
const user=require("../models/user")
// const uniqid=require("uniqid");
const alert=require("alert");

module.exports=function(app,express)
{
    var urlencodedParser=express.urlencoded({extended:false});

    app.get("/info/:id",urlencodedParser,function(req,res){
        console.log(req.params.id);
        group.findOne({_id:req.params.id}).then(function(result){
            console.log(result);
            // app.use(express.static(path.resolve(__dirname+'/views/service')));
            res.render("./service/layout/info.ejs",{group:result})
        })
    });
}