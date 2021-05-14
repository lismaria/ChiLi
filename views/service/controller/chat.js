var socket = io();
 
//DOM 
var user = document.getElementById('output').dataset.test;
var output = document.getElementById("output");
var input = document.getElementById("input");
var username = document.getElementById("username");
var send = document.getElementById("send");


//*** Emit Events ***//

//on Button Click
if(input){
send.addEventListener('click',function(event){
    console.log("click pressed");
    event.preventDefault();
    socket.emit('chat',{
        input: input.value,
        user:user
    });
    input.value = '';
})
}

//on ENTER
if(input){
input.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        console.log("enter pressed");
        event.preventDefault();
        socket.emit('chat',{
            input: input.value,
            user:user
        });
        input.value = '';
    }
});
}


//*** Listen for Events ***//
socket.on('chat',function (data){
    output.innerHTML+='<div class="userProfile" id="userProfile"><div class="userImg"></div><div style="width:100%"><span id="username" class="userName">'+data.user+'</span><div class="message"><p>'+data.input+'</p></div></div></div>'
    
    var element = document.getElementById('output');
    element.scrollTop = element.scrollHeight;
})