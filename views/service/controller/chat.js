var socket = io();
 
//DOM 
var user = document.getElementById('output').dataset.test;                  //getting values from dom elements by ID
var output = document.getElementById("output");
var input = document.getElementById("input");
var username = document.getElementById("username");
var send = document.getElementById("send");


//*** Emit Events ***//

//on Button Click
if(input){                                                          //if there is input, then adding event listener to emit data
send.addEventListener('click',function(event){
    event.preventDefault();
    socket.emit('chat',{
        input: input.value,
        user:user
    });
    input.value = '';                                               //clearing input box after data is sent
})
}

//on ENTER
if(input){
input.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
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
socket.on('chat',function (data){                       //data coming from server and merged into HTML
    output.innerHTML+='<div class="userProfile" id="userProfile"><div class="userImg"></div><div style="width:100%"><span id="username" class="userName">'+data.user+'</span><div class="message"><p>'+data.input+'</p></div></div></div>'
    
    var element = document.getElementById('output');
    element.scrollTop = element.scrollHeight;
})