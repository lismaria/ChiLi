const group=require("../models/group")            //importing the group model
const user=require("../models/user")
const forum=require("../models/forumModel")
const mongoose=require("mongoose")
var showques;
var showans;

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
                    forum.findOne({_id: result.forum_id}).then(function(newforum){
                        if(newforum==null){                                                  //if there are no chats yet, then only pass group object
                            res.render("./service/layout/forums.ejs",{group:result})                                 
                        }
                        else{                                                           //if chats exist, then pass chat object as well
                            res.render("./service/layout/forums.ejs",{group:result,forum:newforum}) 
                        }
                    });
                } 
            }
            if(counter==0){                                                     //if user havent joined the group but is trying to access from url
                res.write("<a href='/'>Return to home</a> <br><br>");
                res.write("No group found");
                res.end();
            }
        })
        var id = mongoose.Types.ObjectId(req.params.id);                        // converting string to type ObjectId
        function showQues(){                                                     // storing from req parameter
            obj={
                groupId: id,
                userRef: req.session.user 
            }
            return obj;
        }  
        showques=showQues; 
    });


    app.get("/forums/:id/:ques",urlencodedParser,function(req,res)
    {
        var counter=0;
        var ques = mongoose.Types.ObjectId(req.params.ques);  
        group.findOne({_id:req.params.id}).then(function(result)            //getting Group ID from url, passed by layout/partials/nav.ejs
        {
            for(i in result.users)
            {
                if(result.users[i].user_name==req.session.user.user_name)       //if the user is found, render the resource page
                {
                    counter=counter+1;
                    forum.aggregate([{$unwind:"$questions"},{$match:{"questions._id":ques}}]).then(function(question){   //getting Questions ID from url, passed by forums.ejs
                        res.render("./service/layout/forums-2.ejs",{group:result,question:question})      //sending group object in layout/forums.ejs
                    });                                              
                } 
            }
            if(counter==0){                                                     //if user havent joined the group but is trying to access from url
                res.write("<a href='/'>Return to home</a> <br><br>");
                res.write("No group found");
                res.end();
            }
        }) 
        function showAns(){                                                     // storing from req parameter
            app={
                postId: ques,
                userRef: req.session.user 
            }
            return app;
        }  
        showans=showAns;
    }); 

    // *** socket.io code *** //
    io.on('connection', function(socket){
        socket.on('post_ques',function(data){              //listening for post question event from client
            socket.emit('post_ques',data);                                       // emiting msg to all sockets(clients) on server
 
            obj=showques();                                                          // storing the return obj of showMsg
 
            forum.findOne({groupid: obj.groupId}).then(function(result){          // finding the current group
                if(result==null){                                                // if no grp found, creating first insttance   
                    var newforum=new forum({                                          //storing the details
                        groupid:obj.groupId,
                        questions:[{             
                            user_name: data.user,
                            ques_title: data.ques_title,
                            ques_descr: data.ques_descr,
                            time: new Date()                            
                        }]
                    });
                    newforum.save().then(function(newdoc)                 //if first chat, then store chat_id in groups Schema for reference
                    {                        
                        group.findOneAndUpdate({_id:obj.groupId},{$push: {forum_id:newdoc._id}}).then(function(frm){
                            socket.emit('reload', {});
                        })
                    })
 
                }
                else{                                                             //if group exists push texts into messages                  
                    forum.findOneAndUpdate({groupid:obj.groupId},{$push:{questions:{user_name:data.user,ques_title:data.ques_title,ques_descr:data.ques_descr,time:new Date()}}}).then(function(result){
                        socket.emit('reload', {});
                    })
                }
            })      
 
        })

        //post answer
        socket.on('post_ans',function(ansData){              //listening for post question event from client
            io.sockets.emit('post_ans',ansData);                                        // emiting msg to all sockets(clients) on server

            obj=showques();
            app=showans();
            forum.findOne({groupid:obj.groupId},{ questions: { $elemMatch: { _id: app.postId } } }).then(function(result)
            {
                console.log(result);
                result.questions[0].answers.push({user_name:ansData.user,ans:ansData.ans,time:new Date()});
                // socket.emit('reload', {});
                result.save();
            })
        })

     }) 
 }