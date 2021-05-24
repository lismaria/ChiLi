var app= angular.module('mod',['ngRoute']);

app.config(function($routeProvider)
{
    $routeProvider
    .when('/',{
        templateUrl:"./views/home.html",
        controller:"homectrl"
    })
    .when('/aboutus',{
        templateUrl:"./views/aboutus.html"
    })
    .when('/contactus',{
        templateUrl:"./views/contactus.html"
    })
    .when('/login',{
        templateUrl:"./views/login.html"
    })
    .when('/signup',{
        templateUrl:"./views/signup.html"
    })
    .otherwise({
        templateUrl:"../404.html"
    })
});

app.controller("ctrl",function($scope)
{
    $scope.theme=true
    $scope.toggletheme=function()
    {
        $scope.theme = $scope.theme == false ? true: false;
    }
});

app.controller("homectrl",function($scope)
{
    $scope.home=[
        {icon:  "fluent:people-audience-20-filled", title: "Forums",descr:"Ask queries, answer questions, help the community learn and grow !"},
        {icon: "emojione-monotone:newspaper",title: 'News',descr:"Post and get news updates about various topics."},
        {icon: "bx:bxs-share-alt",title:'Resources',descr:"Everything becomes smooth when you have an option of sharing files online."},
        {icon:  "clarity:chat-bubble-solid-badged", title:'Messaging',descr:"Take a while off from study and work and have a chat with your mates."}
    ];
});