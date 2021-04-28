var app= angular.module('mod',['ngRoute']);

app.config(function($routeProvider)
{
    $routeProvider
    .when('/',{
        templateUrl:"/views/home.html",
        controller:"homectrl"
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
        {icon:  "fluent:people-audience-20-filled", descr: "Forums"},
        {icon: "emojione-monotone:newspaper",descr: 'News'},
        {icon: "bx:bxs-share-alt",descr:'Resources'},
        {icon:  "clarity:chat-bubble-solid-badged", descr:'Messaging'}
    ];
});