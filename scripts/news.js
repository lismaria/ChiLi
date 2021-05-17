const group=require("../models/group")            //importing the group model
const user=require("../models/user")
const mongoose=require("mongoose")
const news=require("../models/newsModel");
var shownews;

module.exports =function(app,express,io)
{
    var urlencodedParser=express.urlencoded({extended:false});
    app.get("/news/:id",urlencodedParser,function(req,res)
    {
        var counter=0;
        group.findOne({_id:req.params.id}).then(function(result)            //getting Group ID from url, passed by layout/partials/nav.ejs
        {
            for(i in result.users)
            {
                if(result.users[i].user_name==req.session.user.user_name)       //if the user is found, render the resource page
                {
                    counter=counter+1;
                    news.findOne({_id: result.news_id}).then(function(newnews){
                        if(newnews==null){                                                  //if there are no chats yet, then only pass group object
                            res.render("./service/layout/news.ejs",{group:result})                                 
                        }
                        else{                                                           //if chats exist, then pass chat object as well
                            res.render("./service/layout/news.ejs",{group:result,news:newnews}) 
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
        function showNews(){                                                     // storing from req parameter
            obj={
                groupId: id,
                userRef: req.session.user 
            }
            return obj;
        }  
        shownews=showNews;  
    });        

    // *** socket.io code *** //
    io.on('connection', function(socket){
       socket.on('post_news',function(data){
           io.sockets.emit('post_news',data);                                        // emiting msg to all sockets(clients) on server

           obj=shownews();                                                          // storing the return obj of showMsg

           news.findOne({groupid: obj.groupId}).then(function(result){          // finding the current group
               if(result==null){                                                // if no grp found, creating first insttance   
                   var newnews=new news({                                          //storing the details
                       groupid:obj.groupId,
                       newscontent:[{                    
                           user_name: data.user,
                           news_title: data.news_title,
                           news_story: data.news_story,
                           time: new Date()
                       }]
                   });
                   newnews.save().then(function(newdoc)                 //if first chat, then store chat_id in groups Schema for reference
                   {                        
                            group.findOneAndUpdate({_id:obj.groupId},{$push: {news_id:newdoc._id}}).then(function(grp){
                       })
                   })

               }
               else{                                                             //if group exists push texts into messages                  
                   news.findOneAndUpdate({groupid:obj.groupId},{$push:{newscontent:{user_name:data.user,news_title:data.news_title,news_story:data.news_story,time:new Date()}}}).then(function(result){
                       // :D
                       // console.log(date.toLocaleTimeString());
                   })
               }
           })          

       })
    })
}