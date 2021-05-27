const group=require("../models/group")            //importing the group model
const user=require("../models/user")
const chat=require("../models/chatModel")
const mongoose=require("mongoose")
var show;                                          //creating global variable to access showMsg()
module.exports=function(app,express,io)
{
    var urlencodedParser=express.urlencoded({extended:false});

    app.get("/chats/:id",urlencodedParser,function(req,res){
        var counter=0;
        group.findOne({_id:req.params.id}).then(function(result)            //getting Group ID from url, passed by layout/partials/nav.ejs
        {
            for(i in result.users)
            {
                if(result.users[i].user_name==req.session.user.user_name)       //if the user is found, render the chat page
                {
                    counter=counter+1;
                    chat.findOne({_id: result.chat_id}).then(function(msgs){
                        if(msgs==null){                                                  //if there are no chats yet, then only pass group object
                            res.render("./service/layout/chats.ejs",{group:result})                                 
                        }
                        else{                                                           //if chats exist, then pass chat object as well
                            res.render("./service/layout/chats.ejs",{group:result,chat:msgs}) 
                        }
                    });
                } 
            }
            if(counter==0){                                                     //if user havent joined the group but is trying to access from url
                res.write("<a href='/'>Return to home</a> <br><br>");
                res.write("No group found");
                res.end();
            }
            
        });
        var id = mongoose.Types.ObjectId(req.params.id);                        // converting string to type ObjectId
        
        function showMsg(){                                                     // storing from req parameter
            obj={
                groupId: id,
                userRef: req.session.user 
            }
            return obj;
        }  
        show=showMsg;                                                            // storing showMsg()
    });

 // *** socket.io code *** //
    io.sockets.on('connection', function(socket){
        
        socket.on("join",function(room)
        {
            socket.join(room);
        })

        socket.on('chat',function(data){
            obj=show();                                                          // storing the return obj of showMsg
            io.to(data.roomid).emit('chat',data);                                        // emiting msg to all sockets(clients) on server

            chat.findOne({groupid: data.roomid}).then(function(result){          // findong the current group
                if(result==null){                                                // if no grp found, creating first insttance   
                    var newchat=new chat({                                          //storing the details
                        groupid:data.roomid,
                        messages:[{                    
                            user_name: data.user,
                            text: data.input,
                            time: new Date(),
                            profile_pic:data.userdp
                        }]
                    });
                    newchat.save().then(function(newdoc){                        //if first chat, then store chat_id in groups Schema for reference
                        group.findOneAndUpdate({_id:data.roomid},{$push: {chat_id:newdoc._id}}).then(function(grp){
                        })
                    })
                    
                }
                else{                                                             //if group exists push texts into messages                  
                    chat.findOneAndUpdate({groupid:data.roomid},{$push:{messages:{user_name:data.user,text:data.input,time:new Date(),profile_pic:data.userdp}}}).then(function(result){
                    })
                }
            })          
            
        });

        socket.on('typing', function(data){
            socket.to(data.roomid).emit('typing', data);
        });
    })
}