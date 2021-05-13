var socket = io();
 
//DOM 
var output = document.getElementById("output"),
    input = document.getElementById("input"),
    username = document.getElementById("username"),
    send = document.getElementById("send");

//*** Emit Events ***//

//on Button Click
send.addEventListener('click',function(event){
    event.preventDefault();
    socket.emit('chat',{
        input: input.value
    });
    input.value = '';
})

//on ENTER
document.querySelector('#input').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        socket.emit('chat',{
            input: input.value
        });
        input.value = '';
    }
});


//*** Listen for Events ***//
socket.on('chat',function (data){
    output.innerHTML+=data.input;
})