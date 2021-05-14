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
        group.findOne({_id:req.params.id}).then(function(result)            //getting Group ID from url, passed by scripts/groupjoin.js
        {
            for(i in result.users)
            {
                if(result.users[i].user_name==req.session.user.user_name)       //if the user is found, render the info page
                {
                    counter=counter+1;
                    res.render("./service/layout/chats.ejs",{group:result})      //sending group object in layout/info.ejs
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
    io.on('connection', function(socket){
        socket.on('chat',function(data){
            io.sockets.emit('chat',data);                                        // emiting msg to all sockets(clients) on server

            obj=show();                                                          // storing the return obj of showMsg

            chat.findOne({groupid: obj.groupId}).then(function(result){          // findong the current group
                if(result==null){                                                // if no grp found, creating first insttance   
                    var newchat=new chat({                                          //storing the details
                        groupid:obj.groupId,
                        messages:[{                    
                            user_name: data.user,
                            text: data.input,
                        }]
                    });
                    newchat.save();
                }
                else{                                                             //if group exists push texts into messages                  
                    chat.findOneAndUpdate({groupid:obj.groupId},{$push:{messages:{user_name:data.user,text:data.input}}}).then(function(result){
                        // :D
                    })
                }
            })          
            
        })
    })
}