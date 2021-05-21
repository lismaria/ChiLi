var socket = io();

socket.on('reload', function (data) {
    location.reload();
});
 
//DOM 
var user = document.getElementById('forumContent').dataset.test;                  //getting values from dom elements by ID
var forumContent = document.getElementById("forumContent");
var ques_title = document.getElementById("ques_title");
var ques_descr = document.getElementById("ques_descr");
var post_ques = document.getElementById("post_ques");
var post_ans = document.getElementById("post_ans");
var ans_arr = document.getElementById("ans_arr");
var ans = document.getElementById("ans");


//*** Emit Events ***//

//on Button Click
if(ques_title){                                                          //if there is ques_title, then adding event listener to emit data
post_ques.addEventListener('click',function(event){
    event.preventDefault();
    if(ques_title.value.length>0 && ques_descr.value.length>0)
    {
        socket.emit('post_ques',{                        //emit to server
            ques_title: ques_title.value,
            ques_descr: ques_descr.value,
            user:user
        });
    }
    ques_title.value = '';                                               //clearing ques_title box after data is sent
    ques_descr.value = '';
 })
}

if(ans){                                                          //if there is ques_title, then adding event listener to emit data
post_ans.addEventListener('click',function(event){
    event.preventDefault();
    if(ans.value.length>0)
    {
        socket.emit('post_ans',{                        //emit to server
            ans: ans.value,
            user:user
        });
    }
    ans.value = '';                                               //clearing ques_title box after data is sent
 })
}


// *** Listen for Events *** //
socket.on('post_ques',function (data){                   //listening from server
    forumContent.innerHTML+='<a href="/forums/<%=group._id%>/<%=post._id%>" class="ques-block"><div style="display:flex"><div class="userimg"></div><div class="ques-title"><div style="padding-bottom:5px;"><b>'+data.user+'</b></div><div>'+data.ques_title+'</div></div></div><div class="ques-votes"><div class="tooltip"><span class="tooltiptext">0</span></div><div>'+new Date().toLocaleDateString(undefined, {month:"short",year:"numeric",day:"numeric"})+'<br>'+new Date().toLocaleTimeString().replace(/:\d{2}\s/,' ')+'</div></div></a>'
    var element = document.getElementById('forumContent');
    element.scrollTop = element.scrollHeight;
})

socket.on('post_ans',function (ansData){                   //listening from server
    ans_arr.innerHTML+='<div class="answerss"><div style="display:flex;padding: 10px; align-items: center;"><div class="quesimg"></div><div class="queshead"><p>'+ansData.user+'<span class="fdate">'+new Date().toLocaleDateString(undefined, {month:"short",year:"numeric",day:"numeric"})+'</span></p><p>'+ansData.ans+'</p></div></div><div class="ans-votes"><button id="upvote" class="triangle-up" style="cursor: pointer;" type="submit"></button><div id="votes" style="padding: 5px;">0</div><button id="downvote" class="triangle-down" style="cursor: pointer;" type="submit"></button></div></div><hr>'
    var element = document.getElementById('forumQues');
    element.scrollTop = element.scrollHeight;
})

function uClicks(id,quesid,ansid,uid){
    var xhr = new XMLHttpRequest();
    
    console.log("IN uClicks()")
    if(typeof(Storage)!=="undefined"){
        if(localStorage[uid+'ucount'+ansid]>=1){
                console.log("if ucount", localStorage[uid+'ucount'+ansid]);
            }
        else{
                localStorage[uid+'ucount'+ansid]=1;
                console.log("else ucount", localStorage[uid+'ucount'+ansid]);
                xhr.onreadystatechange = function(){ 
                        location.reload();
                    // if (this.readyState == 4 && this.status == 200){
                    //     document.getElementById("votes").innerHTML =this.responseText;
                    //     // console.log("in",this.responseText);
                    // }
                }
                xhr.open("POST","/forums/"+id+"/"+quesid+"/"+ansid+"/upvote");
                xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
                xhr.send();
        }
    }
}

function dClicks(id,quesid,ansid,uid){
    var xhr = new XMLHttpRequest();
    
    console.log("IN dClicks()")
    if(typeof(Storage)!=="undefined"){
        if(localStorage[uid+'dcount'+ansid]>=1){
                console.log("if dcount", localStorage[uid+'dcount'+ansid]);
            }
        else{
                localStorage[uid+'dcount'+ansid]=1;
                console.log("else dcount", localStorage[uid+'dcount'+ansid]);
                xhr.onreadystatechange = function(){ 
                        location.reload();
                    // if (this.readyState == 4 && this.status == 200){
                    //     document.getElementById("votes").innerHTML =this.responseText;
                    //     // console.log("in",this.responseText);
                    // }
                }
                xhr.open("POST","/forums/"+id+"/"+quesid+"/"+ansid+"/downvote");
                xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
                xhr.send();
        }
    }
}

