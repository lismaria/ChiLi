const group=require("../models/group")            //importing the group model
const user=require("../models/user")
const mongoose=require("mongoose")
const resource=require("../models/resourceModel");
const uniqid=require("uniqid");

module.exports =function(app,express,io)
{
    var urlencodedParser=express.urlencoded({extended:false});

    app.get("/resources/:id/:folderid/uploads/:file",urlencodedParser,function(req,res)
    {
        var counter=0;
        var fid = mongoose.Types.ObjectId(req.params.folderid);
        group.findOne({_id:req.params.id}).then(function(result)            //getting Group ID from url, passed by layout/partials/nav.ejs
        {
            for(i in result.users)
            {
                if(result.users[i].user_name==req.session.user.user_name)       //if the user is found, render the resource page
                {
                    counter=counter+1;
                    resource.aggregate([{$unwind:"$folders"},{$match:{"folders._id":fid}}]).then(function(folder){   //getting Questions ID from url, passed by forums.ejs
                        res.render("./service/layout/resources-3.ejs",{file:req.params.file});      //sending group object in layout/forums.ejs
                    });
                } 
            }
            if(counter==0){                                                     //if user havent joined the group but is trying to access from url
                res.write("<a href='/'>Return to home</a> <br><br>");
                res.write("No group found");
                res.end();
            }
        })       
    })


    app.get("/resources/:id/:folderid",urlencodedParser,function(req,res)
    {
        var counter=0;
        var fid = mongoose.Types.ObjectId(req.params.folderid);
        group.findOne({_id:req.params.id}).then(function(result)            //getting Group ID from url, passed by layout/partials/nav.ejs
        {
            for(i in result.users)
            {
                if(result.users[i].user_name==req.session.user.user_name)       //if the user is found, render the resource page
                {
                    counter=counter+1;
                    resource.aggregate([{$unwind:"$folders"},{$match:{"folders._id":fid}}]).then(function(folder){   //getting Questions ID from url, passed by forums.ejs
                        res.render("./service/layout/resources-2.ejs",{group:result,folder:folder})      //sending group object in layout/forums.ejs
                    });
                } 
            }
            if(counter==0){                                                     //if user havent joined the group but is trying to access from url
                res.write("<a href='/'>Return to home</a> <br><br>");
                res.write("No group found");
                res.end();
            }
        })
    }); 


    app.get("/resources/:id",urlencodedParser,function(req,res)
    {
        var counter=0;
        group.findOne({_id:req.params.id}).then(function(result)            //getting Group ID from url, passed by layout/partials/nav.ejs
        {
            for(i in result.users)
            {
                if(result.users[i].user_name==req.session.user.user_name)       //if the user is found, render the resource page
                {
                    counter=counter+1;
                    resource.findOne({_id: result.resource_id}).then(function(newresource)
                    {
                        if(newresource==null){                                                  //if there are no chats yet, then only pass group object
                            res.render("./service/layout/resources.ejs",{group:result})                                 
                        }
                        else{                                                           //if chats exist, then pass chat object as well
                            res.render("./service/layout/resources.ejs",{group:result,resource:newresource}) 
                        }
                    })
                } 
            }
            if(counter==0){                                                     //if user havent joined the group but is trying to access from url
                res.write("<a href='/'>Return to home</a> <br><br>");
                res.write("No group found");
                res.end();
            }
        })
    });        


    app.post("/resources/:id/:folderid/insert-file",urlencodedParser,function(req,res)
    {
        var file = req.files.filename;
        var id = mongoose.Types.ObjectId(req.params.id);
        var fid = mongoose.Types.ObjectId(req.params.folderid);
        var name = req.files.filename.name;
        var mimetype = req.files.filename.mimetype;

        var rename = uniqid('','-'+name);
        file.mv("./views/service/uploads/"+rename,function(err)
        {
            if(err)
            {
                console.log(err);
            }
        });
        
        resource.findOne({groupid:id},{ folders: { $elemMatch: { _id: fid } } }).then(function(result)
        {
            result.folders[0].files.push({name:name,mimetype:mimetype,rename:rename});
            result.save().then(function(newfile)
            {
                res.redirect("/resources/"+id+"/"+fid);
            })
        })
    })


    app.post("/resources/:id/create-folder",urlencodedParser,function(req,res)
    {
        var id = mongoose.Types.ObjectId(req.params.id);
        resource.findOne({groupid: id}).then(function(result)                   // finding the current group
        {          
            if(result==null)
            {                                                // if no grp found, creating first insttance   
                var newresource=new resource({                                          //storing the details
                    groupid: id,
                    folders:[{             
                        folder_name: req.body.folder_name,                           
                    }]
                })
                newresource.save().then(function(newdoc)
                {
                    group.findOneAndUpdate({_id:id},{$push: {resource_id:newdoc._id}}).then(function(frm){
                        res.redirect("/resources/"+id);
                    })
                })
            }
            else
            {                                                             //if group exists push texts into messages                  
                resource.findOneAndUpdate({groupid:id},{$push:{folders:{folder_name:req.body.folder_name}}}).then(function(result){
                    res.redirect("/resources/"+id);
                })
            }
        });
    })
}