var socket = io();
 
//DOM 
var user = document.getElementById('forumContent').dataset.test;                  //getting values from dom elements by ID
var forumContent = document.getElementById("forumContent");
var ques_title = document.getElementById("ques_title");
var ques_descr = document.getElementById("ques_descr");
var post_ques = document.getElementById("post_ques");


//*** Emit Events ***//

//on Button Click
if(ques_title){                                                          //if there is ques_title, then adding event listener to emit data
post_ques.addEventListener('click',function(event){
    event.preventDefault();
    if(ques_title.value.length>0 && ques_descr.value.length>0)
    {
        socket.emit('post_ques',{
            ques_title: ques_title.value,
            ques_descr: ques_descr.value,
            user:user
        });
    }
    ques_title.value = '';                                               //clearing ques_title box after data is sent
    ques_descr.value = '';
})
}


// *** Listen for Events *** //
socket.on('post_ques',function (data){
    forumContent.innerHTML+='<a href="/forums/<%=group._id%>/ques" class="ques-block"><div style="display:flex"><div class="userimg"></div><div class="ques-title"><div style="padding-bottom:5px;"><b>'+data.user+'</b></div><div>'+data.ques_title+'</div></div></div><div class="ques-votes"><div class="tooltip"><span class="tooltiptext">0</span></div><div>'+new Date().toLocaleDateString(undefined, {month:"short",year:"numeric",day:"numeric"})+'<br>'+new Date().toLocaleTimeString().replace(/:\d{2}\s/,' ')+'</div></div></a>'
    var element = document.getElementById('forumContent');
    element.scrollTop = element.scrollHeight;
})