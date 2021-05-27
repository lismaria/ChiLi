var socket = io();
 
//DOM 
var newsid = document.getElementById('newsid').dataset.test;
var user = document.getElementById('news-content-column').dataset.test;                  //getting values from dom elements by ID
var news_content_column = document.getElementById("news-content-column");
var news_title = document.getElementById("news_title");
var news_story = document.getElementById("news_story");
var post_news = document.getElementById("post_news");


//*** Emit Events ***//

socket.emit("join",newsid);

//on Button Click
if(news_title){                                                          //if there is news_title, then adding event listener to emit data
post_news.addEventListener('click',function(event){
    event.preventDefault();
    if(news_title.value.length>0 && news_story.value.length>0)
    {
        socket.emit('post_news',{
            news_title: news_title.value,
            news_story: news_story.value,
            user:user,
            newsid: newsid
        });
    }
    news_title.value = '';                                               //clearing news_title box after data is sent
    news_story.value = '';
})
}


// *** Listen for Events *** //
socket.on('post_news',function (data){
    news_content_column.innerHTML+='<div class="flip-card"><div class="flip-card-inner"><div class="flip-card-front"><p class="flip-card-mark">'+new Date().toLocaleDateString(undefined, {month:'short',year:'numeric',day:'numeric'})+'</p><h1>'+data.news_title+'</h1><div><span>'+data.user+'</span></div></div><div class="flip-card-back"><p class="flip-card-mark  flip-card-mark-back">'+new Date().toLocaleTimeString().replace(/:\d{2}\s/,' ')+'</p><p style="margin: 0 10px 10px;">'+data.news_story+'</p></div></div></div>'
    var element = document.getElementById('news-content-column');
    element.scrollTop = element.scrollHeight;
})