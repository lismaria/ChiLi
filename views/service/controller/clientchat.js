var socket = io();
 
//DOM 
var user = document.getElementById('output').dataset.test;                  //getting values from dom elements by ID
var output = document.getElementById("output");
var input = document.getElementById("input");
var username = document.getElementById("username");
var send = document.getElementById("send");
var feedback = document.getElementById("feedback");


//*** Emit Events ***//

//on Button Click
if(input){                                                          //if there is input, then adding event listener to emit data
send.addEventListener('click',function(event){
    event.preventDefault();
    if(input.value.length>0)
    {
        socket.emit('chat',{
            input: input.value,
            user:user
        });
    }
    input.value = '';                                               //clearing input box after data is sent
})
}

//on ENTER
if(input){
input.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        if(input.value.length>0)
        {
            socket.emit('chat',{
                input: input.value,
                user:user,
                time: new Date()
            });            
        }
        input.value = '';
    }
});
}


// input.addEventListener('keypress', function(){
//     console.log("Line 48")
//     socket.emit('typing', user);
// })


//*** Listen for Events ***//
socket.on('chat',function (data){
    feedback.innerHTML="";
    output.innerHTML+='<div class="userProfile" id="userProfile"><div class="userImg"></div><div style="width:100%"><span id="username" class="userName">'+data.user+'</span><div class="message"><p>'+data.input+'</p><span>'+new Date().toLocaleTimeString().replace(/:\d{2}\s/,' ')+'</span></div></div></div>'
    var element = document.getElementById('output');
    element.scrollTop = element.scrollHeight;
    // feedback.innerHTML="";
})

// socket.on('typing', function(data){
//     console.log("Line 63")
//     feedback.innerHTML = '<p><em>' + data + ' is typing...</em></p>';
// });