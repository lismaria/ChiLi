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

        socket.on("join",function(room)
        {
            console.log("joining forum");
            console.log("forumsid: " + room)
            socket.join(room);
        })

        socket.on('post_ques',function(data){              //listening for post question event from client
            console.log("in server posting ques")
            //io.to(`${socket.id}`).emit('post_ques',data);
            socket.emit('post_ques',data);                                       // emiting msg to all sockets(clients) on server
            console.log("emitted  ques to client from server")  
 
            obj=showques();                                                          // storing the return obj of showMsg
 
            forum.findOne({groupid: data.forumsid}).then(function(result){          // finding the current group
                if(result==null){                                                // if no grp found, creating first insttance   
                    var newforum=new forum({                                          //storing the details
                        groupid:data.forumsid,
                        questions:[{             
                            user_name: data.user,
                            ques_title: data.ques_title,
                            ques_descr: data.ques_descr,
                            time: new Date(),
                            profile_pic: data.userdp                        
                        }]
                    });
                    newforum.save().then(function(newdoc)                 //if first chat, then store chat_id in groups Schema for reference
                    {                        console.log("saving to db");
                        group.findOneAndUpdate({_id:data.forumsid},{$push: {forum_id:newdoc._id}}).then(function(frm){
                            socket.emit('reload', {});
                        })
                    })
 
                }
                else{                     console.log("saving to db");                                        //if group exists push texts into messages                  
                    forum.findOneAndUpdate({groupid:data.forumsid},{$push:{questions:{user_name:data.user,ques_title:data.ques_title,ques_descr:data.ques_descr,time:new Date(),profile_pic: data.userdp}}}).then(function(result){
                        socket.emit('reload', {});
                    })
                }
            })      
 
        })

        // socket.on("ques",function(room)
        // {
        //     console.log("joining");
        //     console.log("quesid: " + room)
        //     socket.join(room);
        // })

        //post answer
        socket.on('post_ans',function(ansData){              //listening for post question event from client
            console.log("in server")
            // socket.emit('post_ans',ansData);                                        // emiting msg to all sockets(clients) on server
            io.to(`${socket.id}`).emit('post_ans',ansData); 
            //valid//io.of(ansData.quesid).to(ansData.forumsid).emit('post_ans',ansData);
            console.log("emitted to client from server")
            obj=showques();
            app=showans();
            forum.findOne({groupid:ansData.forumsid},{ questions: { $elemMatch: { _id: ansData.questionid} } }).then(function(result)
            {
                console.log("saving to db");
                result.questions[0].answers.push({user_name:ansData.user,ans:ansData.ans,time:new Date(),votes:0,profile_pic:ansData.userdp});
                socket.emit('reload', {});
                result.save();
            })
        })
     }) 


    app.post("/forums/:id/:quesid/:ansid/upvote",function(req,res)
    {
        var id = mongoose.Types.ObjectId(req.params.id);
        var quesid = mongoose.Types.ObjectId(req.params.quesid);
        var ansid = mongoose.Types.ObjectId(req.params.ansid);

        forum.findOneAndUpdate(
            { groupid: id },
            { $inc: { "questions.$[q].answers.$[a].votes": 1 } },
            { arrayFilters: [ { 'q._id': quesid }, { 'a._id': ansid } ] }).then(function(rrr){
                res.redirect("/forums/"+id+"/"+quesid);
        })
    })


    app.post("/forums/:id/:quesid/:ansid/downvote",function(req,res)
    {
        var id = mongoose.Types.ObjectId(req.params.id);
        var quesid = mongoose.Types.ObjectId(req.params.quesid);
        var ansid = mongoose.Types.ObjectId(req.params.ansid);

        forum.findOneAndUpdate(
            { groupid: id },
            { $inc: { "questions.$[q].answers.$[a].votes": -1 } },
            { arrayFilters: [ { 'q._id': quesid }, { 'a._id': ansid } ] }).then(function(rrr){
                res.redirect("/forums/"+id+"/"+quesid);
        })
    })


    app.post("/forums/:id/search",function(req,res)
    {
        var searchstr=new RegExp(req.body.searchQues,'i');
        forum.aggregate([
            {
                $unwind: '$questions'
            },
            {
                $match: {
                    'questions.ques_title': searchstr
                }
            },
            {
                $project: {
                    _id: '$questions._id',
                    user_name:'$questions.user_name',
                    ques_title: '$questions.ques_title',
                    ques_descr: '$questions.ques_descr',
                    time:'$questions.time',
                    profile_pic:'$questions.profile_pic',
                    answers:'$questions.answers'
                }
            }
        ]).then(function(result)
        {
            group.findOne({_id:req.params.id}).then(function(group)
            {
                res.render("./service/layout/forums-3.ejs",{searcharr:result,group:group})
            });
        });
    });
}


 // app.post("/forums/:id/:quesid/:ansid/upvote",function(req,res)
        // {
        //     var id = mongoose.Types.ObjectId(req.params.id);
        //     var quesid = mongoose.Types.ObjectId(req.params.quesid);
        //     var ansid = mongoose.Types.ObjectId(req.params.ansid);
    
        //     forum.findOneAndUpdate(
        //         { groupid: id },
        //         { $inc: { "questions.$[q].answers.$[a].votes": 1 } },
        //         { arrayFilters: [ { 'q._id': quesid }, { 'a._id': ansid } ] }).then(function(rrr){
                    // // console.log(rrr);
                    // // res.redirect("/forums/"+id+"/"+quesid);
                    // // console.log(rrr.questions.$[quesid])
                    // console.log(rrr.questions[quesid])

                    // // console.log(rrr.questions[quesid].answers[ansid])
                    // votes=rrr.questions[quesid].answers[ansid].votes;
                    // console.log("votes")
                    // // res.redirect("/forums/"+id+"/"+quesid);
                    // forum.aggregate([
                    //     {
                    //         $unwind: '$questions'
                    //     },
                    //     {
                    //         $match: {
                    //             'questions._id':quesid
                    //         }
                    //     },
                    //     {
                    //         $project: {
                    //             answers:'$questions.answers'
                    //         }
                    //     }
                    // ]).then(function(arr){
                    //     for(i in arr[0].answers){
                    //         if(arr[0].answers[i]._id==req.params.ansid){
                    //             var votes=arr[0].answers[i].votes;
                    //             res.status(200).send(votes.toString());
                    //         }
                    //     }
                    // })
    //         })
    //     })
    // })






            // var id = mongoose.Types.ObjectId(req.params.id);
            // var quesid = mongoose.Types.ObjectId(req.params.quesid);
            // var ansid = mongoose.Types.ObjectId(req.params.ansid);
    
            // forum.findOneAndUpdate(
            //     { groupid: id },
            //     { $inc: { "questions.$[q].answers.$[a].votes": -1 } },
            //     { arrayFilters: [ { 'q._id': quesid }, { 'a._id': ansid } ] }).then(function(rrr){
                    // forum.aggregate([
                    //     {
                    //         $unwind: '$questions'
                    //     },
                    //     {
                    //         $match: {
                    //             'questions._id':quesid
                    //         }
                    //     },
                    //     {
                    //         $project: {
                    //             answers:'$questions.answers'
                    //         }
                    //     }
                    // ]).then(function(arr){
                    //     for(i in arr[0].answers){
                    //         if(arr[0].answers[i]._id==req.params.ansid){
                    //             var votes=arr[0].answers[i].votes;
                    //             res.status(200).send(votes.toString());
                    //         }
                    //     }
                    // })
//             })
            
//         })
//     })
// }       
// }
